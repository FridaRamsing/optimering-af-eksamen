export default async function KategoriPage({ params }) {
  const { kategori } = await params;

  return (
    <main>
      <h1>Kategori: {kategori}</h1>
    </main>
  );
}
