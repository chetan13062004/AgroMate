export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About FarmMarket</h1>
        <p className="text-xl text-gray-600">Connecting farmers and customers for a sustainable future</p>
      </div>

      <div className="prose prose-lg mx-auto">
        <p>
          FarmMarket is a revolutionary platform that bridges the gap between local farmers and conscious consumers. Our
          mission is to create a sustainable ecosystem where farmers can directly sell their fresh produce while
          customers get access to the highest quality, farm-fresh products.
        </p>

        <h2>Our Vision</h2>
        <p>
          We envision a world where every farmer has direct access to markets, every consumer knows where their food
          comes from, and sustainable farming practices are rewarded and encouraged.
        </p>

        <h2>What We Offer</h2>
        <ul>
          <li>Direct farmer-to-consumer marketplace</li>
          <li>Equipment rental services for farmers</li>
          <li>AI-powered crop disease detection</li>
          <li>Real-time communication between farmers and buyers</li>
          <li>Seasonal crop guidance and farming tips</li>
        </ul>

        <h2>Our Impact</h2>
        <p>
          Since our launch, we've helped over 1,000 farmers increase their income by 40% on average, while providing
          customers with access to fresh, organic produce at fair prices. We've facilitated over 10,000 transactions and
          continue to grow our community of conscious consumers and sustainable farmers.
        </p>
      </div>
    </div>
  )
}
