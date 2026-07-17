export default function ComparisonTable() {
  const features = [
    { name: "AI Engine", ideaforge: "IdeaForge AI (9-Dimension)", others: "Generic single-score" },
    { name: "Analysis Depth", ideaforge: "SWOT + Skeptic + Market Timing", others: "Basic surface-level" },
    { name: "Report Speed", ideaforge: "15-30 seconds", others: "5-10 minutes" },
    { name: "Competitor Data", ideaforge: "Real-time web-sourced analysis", others: "Static/outdated" },
    { name: "Market Sizing", ideaforge: "TAM / SAM / SOM with data", others: "Not available" },
    { name: "GTM Experiments", ideaforge: "4 auto-generated experiments", others: "Not available" },
    { name: "Export Options", ideaforge: "PDF, Share, Compare", others: "PDF only" },
    { name: "Idea Comparison", ideaforge: "Side-by-side radar charts", others: "No" },
    { name: "Pivot Assistant", ideaforge: "AI chat + 3 pivot directions", others: "Not available" },
    { name: "Action Plan", ideaforge: "7-day step-by-step plan", others: "Generic advice" },
    { name: "Price", ideaforge: "Free / $19/mo", others: "$49-99/mo" },
  ];
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-heading">Why Choose IdeaForge AI?</h2>
          <p className="text-body mt-3">See how we compare to traditional validation tools</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-heading">Feature</th>
                <th className="text-center px-6 py-4 font-semibold text-primary">IdeaForge AI</th>
                <th className="text-center px-6 py-4 font-semibold text-muted">Others</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={f.name} className={i % 2 === 0 ? "bg-white" : "bg-surface/50"}>
                  <td className="px-6 py-3.5 font-medium text-heading">{f.name}</td>
                  <td className="px-6 py-3.5 text-center text-green-600 font-medium">{f.ideaforge}</td>
                  <td className="px-6 py-3.5 text-center text-muted">{f.others}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
