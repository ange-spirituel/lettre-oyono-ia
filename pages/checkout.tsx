export default function Checkout() {
  const handleCheckout = async () => {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Erreur lors de la redirection vers Stripe.');
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Lettre IA – Paiement</h1>
      <p className="text-lg mb-6">Payez 1 € pour générer une lettre IA personnalisée.</p>
      <button
        onClick={handleCheckout}
        className="bg-yellow-400 text-black px-6 py-3 rounded-xl text-lg font-semibold hover:scale-105 transition"
      >
        Payer maintenant
      </button>
    </main>
  );
}
