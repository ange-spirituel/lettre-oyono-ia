import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 py-10">
      <Head>
        <title>ProLettre Oyono IA – Rédaction intelligente</title>
      </Head>

      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          ProLettre Oyono IA
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Générez des lettres, emails, CV, pitchs, messages pros ou persos en quelques secondes grâce à l'intelligence artificielle.
        </p>

        <p className="text-md text-gray-700 mb-10">
          Vous avez besoin d’une <strong>lettre de motivation percutante</strong>, d’un <strong>message professionnel</strong>, d’un <strong>CV rapide</strong> ou même d’un <strong>pitch de startup</strong> ?<br />
          ProLettre Oyono IA est là pour tout générer automatiquement, proprement, et en PDF.
        </p>

        <Link
          href="/generate"
          className="inline-block bg-blue-600 text-white text-lg px-6 py-3 rounded shadow hover:bg-blue-700 transition"
        >
          Générer un contenu maintenant
        </Link>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-4">Types de contenus disponibles :</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
            {[
              'Lettre de motivation',
              'Email professionnel',
              'Bio LinkedIn',
              'Message de relance',
              'Lettre d’excuse',
              'Lettre d’amour',
              'Lettre de rupture',
              'Lettre de remerciement',
              'Message à un client',
              'Pitch startup',
              'Description produit',
              'Annonce de recrutement',
              'Script vidéo TikTok',
              'Publication LinkedIn',
              'Lettre à un ami',
              'Lettre de départ',
              'Réponse à une critique',
              'Email de candidature spontanée',
              'Message Tinder',
            ].map((type) => (
              <li key={type} className="bg-gray-100 p-3 rounded">{type}</li>
            ))}
          </ul>
        </div>

        <div className="mt-16 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ProLettre Oyono IA. Tous droits réservés.
        </div>
      </main>
    </div>
  );
}
