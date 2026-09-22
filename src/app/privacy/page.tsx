import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/landing/legal-page";
import { fetchAppSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Plapod";
  return {
    title: `Kebijakan Privasi | ${brand}`,
    description: `Bagaimana ${brand} mengumpulkan, menggunakan, dan melindungi data Anda.`,
    alternates: { canonical: "/privacy", languages: { "id-ID": "/privacy", "en-US": "/en/privacy" } },
  };
}

export default function Page() {
  const sections: LegalSection[] = [
    {
      heading: "1. Data yang kami kumpulkan",
      body: [
        "Data akun: nama, alamat email, dan kata sandi yang disimpan dalam bentuk hash.",
        "Data penagihan: saldo, riwayat transaksi, dan metode pembayaran. Nomor kartu tidak kami simpan; pemrosesan dilakukan oleh penyedia pembayaran.",
        "Data pemakaian: jumlah token, model yang dipakai, waktu, dan kode status tiap permintaan. Data ini dipakai untuk menagih dan menampilkan pemakaian Anda.",
        "Isi permintaan: prompt dan keluaran model diproses untuk menghasilkan respons. Lihat bagian 3 mengenai penerusan ke pihak ketiga.",
        "Data teknis: alamat IP, jenis perangkat, dan log akses untuk keamanan serta pencegahan penyalahgunaan.",
      ],
    },
    {
      heading: "2. Dasar dan tujuan penggunaan",
      body: [
        "Kami menggunakan data Anda untuk menyediakan layanan, menghitung tagihan, menjaga keamanan, dan memenuhi kewajiban hukum.",
        "Kami tidak menjual data pribadi Anda kepada pihak lain.",
        "Kami tidak memakai isi prompt Anda untuk melatih model kami sendiri.",
      ],
    },
    {
      heading: "3. Penerusan ke penyedia model",
      body: [
        "Untuk menghasilkan respons, permintaan Anda diteruskan ke penyedia model AI pihak ketiga. Karena itu isi prompt Anda keluar dari infrastruktur kami.",
        "Jangan mengirim data pribadi sensitif, rahasia dagang, atau data yang dilindungi regulasi tertentu melalui API ini.",
        "Kebijakan penyedia pihak ketiga berlaku atas pemrosesan di sisi mereka.",
      ],
    },
    {
      heading: "4. Penyimpanan dan keamanan",
      body: [
        "Kata sandi disimpan dalam bentuk hash. Kunci API disimpan dalam bentuk hash dan hanya ditampilkan sekali saat dibuat.",
        "Kami memakai koneksi terenkripsi (HTTPS) untuk seluruh lalu lintas data.",
        "Data disimpan selama akun Anda aktif. Setelah akun ditutup, data dihapus atau dianonimkan, kecuali data yang wajib disimpan untuk keperluan pembukuan dan hukum.",
      ],
    },
    {
      heading: "5. Hak Anda",
      body: [
        "Anda dapat meminta salinan, koreksi, atau penghapusan data pribadi Anda.",
        "Anda dapat mengekspor riwayat pemakaian dari dashboard.",
        "Ajukan permintaan melalui kontak di bagian 7. Kami menanggapi dalam waktu yang wajar.",
      ],
    },
    {
      heading: "6. Cookie",
      body: [
        "Kami memakai cookie yang diperlukan untuk menjaga sesi login. Tanpa cookie ini Anda tidak dapat masuk ke dashboard.",
        "Kami tidak memakai cookie iklan pihak ketiga di halaman ini.",
      ],
    },
    {
      heading: "7. Kontak",
      body: [
        "Pertanyaan mengenai privasi dapat dikirim ke: [ISI: alamat email resmi Anda]",
        "Alamat terdaftar: [ISI: alamat terdaftar perusahaan]",
      ],
    },
    {
      heading: "8. Perubahan",
      body: [
        "Kebijakan ini dapat diperbarui. Perubahan penting akan kami beritahukan melalui email atau pemberitahuan di dashboard.",
      ],
    },
  ];

  return (
    <LegalPage
      locale="id"
      eyebrow="Legal"
      title="Kebijakan Privasi"
      updated="[ISI: tanggal berlaku]"
      intro="Halaman ini menjelaskan data apa yang kami kumpulkan saat Anda memakai layanan ini, mengapa kami mengumpulkannya, dan apa hak Anda atas data tersebut."
      sections={sections}
    />
  );
}
