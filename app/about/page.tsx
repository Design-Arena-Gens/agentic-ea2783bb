export default function AboutPage() {
  return (
    <main className="container">
      <h1 className="text-3xl font-extrabold mb-2">About</h1>
      <div className="card">
        <p className="text-gray-200">
          AI Dance Coach listens to your music, estimates the tempo, and generates a simple
          choreography with clear cues. It runs entirely in your browser using Web Audio.
        </p>
        <ul className="list-disc pl-6 mt-3 text-gray-300">
          <li>Upload a track or record from your microphone</li>
          <li>Beat-synced eight-counts with visual and voice coaching</li>
          <li>Animated dancer demonstrates foundational moves</li>
        </ul>
      </div>
    </main>
  );
}
