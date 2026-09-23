import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/landing/legal-page";
import { fetchAppSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Plapod";
  return {
    title: `Syarat & Ketentuan | ${brand}`,
    description: `Ketentuan penggunaan layanan ${brand}.`,
    alternates: { canonical: "/terms", languages: { "id-ID": "/terms", "en-US": "/en/terms" } },
  };
}

export default function Page() {
  const sections: LegalSection[] = [
    {
      heading: "1. Penerimaan ketentuan",
      body: [
        "Dengan membuat akun atau memakai layanan ini, Anda menyetujui ketentuan ini. Jika Anda tidak menyetujuinya, jangan gunakan layanan ini.",
        "Jika Anda mendaftar atas nama organisasi, Anda menyatakan berwenang mewakili organisasi tersebut.",
      ],
    },
    {
      heading: "2. Akun Anda",
      body: [
        "Anda bertanggung jawab menjaga kerahasiaan kata sandi dan kunci API Anda.",
        "Semua aktivitas yang terjadi dengan kunci API Anda dianggap sebagai aktivitas Anda.",
        "Beri tahu kami segera jika Anda menduga kunci API Anda bocor, agar dapat kami cabut.",
      ],
    },
    {
      heading: "3. Penggunaan yang dilarang",
      body: [
        "- Melanggar hukum yang berlaku, termasuk menyebarkan konten ilegal.",
        "- Menghasilkan spam, malware, atau serangan siber.",
        "- Mengakses layanan dengan cara yang mengganggu ketersediaan bagi pengguna lain.",
        "- Membuat banyak akun untuk menghindari batas atau memanen saldo promosi.",
        "- Menjual kembali akses tanpa perjanjian tertulis dengan kami.",
      ],
    },
    {
      heading: "4. Saldo, tagihan, dan pengembalian dana",
      body: [
        "Layanan AI ditagih berdasarkan pemakaian token sesuai tarif yang tercantum di katalog. Harga yang berlaku adalah harga saat permintaan diproses.",
        "Saldo kredit yang sudah terpakai tidak dapat dikembalikan.",
        "Kesalahan penagihan yang terbukti akibat kesalahan sistem kami akan kami koreksi.",
        "Pengembalian dana untuk saldo yang belum terpakai diatur dalam [ISI: kebijakan pengembalian dana Anda].",
      ],
    },
    {
      heading: "5. Ketersediaan layanan",
      body: [
        "Kami berupaya menjaga layanan tetap tersedia, namun tidak menjamin layanan bebas gangguan.",
        "Model pihak ketiga dapat berubah, dibatasi, atau dihentikan oleh penyedianya. Kami dapat menghentikan dukungan suatu model dengan pemberitahuan.",
        "Kami tidak bertanggung jawab atas kerugian akibat gangguan yang berada di luar kendali kami.",
      ],
    },
    {
      heading: "6. Kekayaan intelektual",
      body: [
        "Anda tetap memiliki hak atas konten yang Anda kirim dan keluaran yang Anda terima, sejauh diizinkan hukum dan ketentuan penyedia model.",
        "Anda bertanggung jawab memastikan Anda berhak menggunakan konten yang Anda kirim.",
      ],
    },
    {
      heading: "7. Pembatasan tanggung jawab",
      body: [
        "Layanan ini disediakan sebagaimana adanya. Sejauh diizinkan hukum, tanggung jawab kami dibatasi pada jumlah yang Anda bayarkan dalam [ISI: periode, mis. 3 bulan] terakhir.",
      ],
    },
    {
      heading: "8. Penghentian",
      body: [
        "Anda dapat menutup akun kapan saja melalui dashboard.",
        "Kami dapat menangguhkan atau menutup akun yang melanggar ketentuan ini, dengan pemberitahuan bila memungkinkan.",
      ],
    },
    {
      heading: "9. Hukum yang berlaku",
      body: [
        "Ketentuan ini diatur oleh hukum [ISI: kota/negara hukum yang berlaku].",
        "Sengketa diselesaikan melalui [ISI: jalur penyelesaian sengketa Anda].",
      ],
    },
    {
      heading: "10. Kontak",
      body: [
        "Pertanyaan mengenai ketentuan ini: [ISI: alamat email resmi Anda]",
      ],
    },
  ];

  return (
    <LegalPage
      locale="id"
      title="Syarat & Ketentuan"
      updated="[ISI: tanggal berlaku]"
      intro="Ketentuan ini mengatur penggunaan layanan AI dan infrastruktur yang kami sediakan."
      sections={sections}
    />
  );
}
