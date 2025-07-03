export default function TestStyles() {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold text-foreground">Tailwind Test</h1>
          
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4">Card Test</h2>
            <p className="text-muted-foreground">This should be styled properly.</p>
          </div>
  
          <div className="flex gap-4">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-80 transition-opacity">
              Primary Button
            </button>
            <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:opacity-80 transition-opacity">
              Secondary Button
            </button>
          </div>
  
          <div className="animate-fade-in">
            <p className="text-lg">This should fade in</p>
          </div>
        </div>
      </div>
    )
  }