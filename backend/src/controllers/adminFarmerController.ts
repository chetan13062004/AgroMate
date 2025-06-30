import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { notifyFarmerOfApproval, notifyFarmerOfRejection } from '../utils/emailService';


interface RejectRequest extends Request {
  params: {
    id: string;
  };
  body: {
    reason?: string;
  };
}

// @desc    Get all farmers pending approval
// @route   GET /api/farmers/pending
// @access  Private/Admin
// Get all farmers pending approval
export const getPendingFarmers = async (_req: Request, res: Response): Promise<Response | void> => {
  try {
    const farmers = await User.find({ role: 'farmer', isApproved: false }).select('-password');
    return res.status(200).json({
      status: 'success',
      results: farmers.length,
      data: { farmers },
    });
  } catch (error) {
    console.error('Error fetching pending farmers:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch farmers' });
  }
};

// @desc    Approve farmer
// @route   PATCH /api/farmers/:id/approve
// @access  Private/Admin
// Get all farmers
export const getAllFarmers = async (_req: Request, res: Response): Promise<Response | void> => {
  try {
    const farmers = await User.find({ role: 'farmer' }).select('-password');
    return res.status(200).json({ status: 'success', results: farmers.length, data: { farmers } });
  } catch (error) {
    console.error('Error fetching farmers:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch farmers' });
  }
};

// Reject a farmer (set isApproved to false)
export const rejectFarmer = async (req: RejectRequest, res: Response): Promise<Response | void> => {
  try {
    const farmer = await User.findById(req.params.id);
    if (!farmer || farmer.role !== 'farmer') {
      console.log(`❌ Farmer not found with ID: ${req.params.id}`);
      return res.status(404).json({ status: 'error', message: 'Farmer not found' });
    }
    
    farmer.isApproved = false;
    await farmer.save();
    console.log(`❌ Farmer rejected: ${farmer.email} (ID: ${farmer._id})`);
    
    // Send rejection email to farmer
    try {
      await notifyFarmerOfRejection(farmer, req.body.reason);
      console.log(`📧 Sent rejection email to: ${farmer.email}`);
    } catch (emailErr) {
      console.error('❌ Failed to send rejection email:', emailErr);
    }
    
    return res.status(200).json({ 
      status: 'success', 
      data: { farmer },
      message: 'Farmer rejected. Notification email sent.'
    });
  } catch (error) {
    console.error('Error rejecting farmer:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to reject farmer' 
    });
  }
};

// Delete a farmer
export const deleteFarmer = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const farmer = await User.findById(req.params.id);
    if (!farmer || farmer.role !== 'farmer') {
      return res.status(404).json({ status: 'error', message: 'Farmer not found' });
    }
    await farmer.deleteOne(); // Use deleteOne instead of deprecated remove()
    return res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    console.error('Error deleting farmer:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to delete farmer' });
  }
};

// Approve a farmer (set isApproved to true)
export const approveFarmer = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const farmer = await User.findById(req.params.id);
    if (!farmer || farmer.role !== 'farmer') {
      console.log(`❌ Farmer not found with ID: ${req.params.id}`);
      return res.status(404).json({ status: 'error', message: 'Farmer not found' });
    }
    
    farmer.isApproved = true;
    await farmer.save();
    console.log(`✅ Farmer approved: ${farmer.email} (ID: ${farmer._id})`);
    
    // Send approval email to farmer
    try {
      await notifyFarmerOfApproval(farmer);
      console.log(`📧 Successfully sent approval email to: ${farmer.email}`);
    } catch (emailErr) {
      console.error('❌ Failed to send farmer approval email:', emailErr);
    }
    
    return res.status(200).json({ 
      status: 'success', 
      data: { farmer },
      message: 'Farmer approved successfully. Notification email sent.'
    });
  } catch (error) {
    console.error('Error approving farmer:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to approve farmer' });
  }
};

// @desc    Update farmer approval status (generic handler used by admin panel)
// @route   PATCH /api/farmers/:id
// @access  Private/Admin
// Update farmer approval status (generic handler)
export const updateFarmerApproval = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { isApproved } = req.body;
    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({ status: 'error', message: 'isApproved field must be boolean' });
    }
    const farmer = await User.findById(req.params.id);
    if (!farmer || farmer.role !== 'farmer') {
      return res.status(404).json({ status: 'error', message: 'Farmer not found' });
    }
    farmer.isApproved = isApproved;
    await farmer.save();
    return res.status(200).json({ status: 'success', data: { farmer } });
  } catch (error) {
    console.error('Error updating farmer approval:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to update farmer approval' });
  }
};
