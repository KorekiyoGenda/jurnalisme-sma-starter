import { FileText, Users, CheckCircle, AlertCircle, BookOpen, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/SectionHeading';

export default function GuidelinesPage() {
  const writingSteps = [
    {
      title: "Riset dan Persiapan",
      description: "Kumpulkan fakta, data, dan sumber yang kredibel sebelum menulis",
      icon: "📊"
    },
    {
      title: "Buat Kerangka",
      description: "Susun outline dengan struktur: lead, body, dan conclusion",
      icon: "📝"
    },
    {
      title: "Tulis Draft Pertama",
      description: "Fokus pada alur cerita dan informasi penting",
      icon: "✏️"
    },
    {
      title: "Review dan Edit",
      description: "Periksa faktual, tata bahasa, dan keterbacaan artikel",
      icon: "🔍"
    },
    {
      title: "Finalisasi",
      description: "Tambahkan foto, caption, dan metadata sebelum publish",
      icon: "✅"
    }
  ];

  const articleTypes = [
    {
      type: "Berita (News)",
      description: "Laporan peristiwa terkini yang bersifat faktual",
      example: "Prestasi siswa, kegiatan sekolah, pengumuman penting",
      length: "300-500 kata"
    },
    {
      type: "Feature",
      description: "Artikel mendalam tentang topik tertentu",
      example: "Profil siswa berprestasi, tips belajar, review kegiatan",
      length: "500-800 kata"
    },
    {
      type: "Opinion",
      description: "Artikel berisi pandangan atau analisis penulis",
      example: "Editorial, kolom siswa, tanggapan terhadap isu",
      length: "400-600 kata"
    }
  ];

  const ethicsRules = [
    "Selalu verifikasi informasi dari sumber yang kredibel",
    "Hormati privacy dan tidak menyebarkan informasi pribadi",
    "Gunakan bahasa yang sopan dan tidak menyinggung",
    "Berikan kesempatan hak jawab kepada pihak terkait",
    "Cantumkan sumber dan credit foto dengan benar",
    "Hindari plagiarisme dan selalu buat konten original"
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <SectionHeading 
          title="Panduan Menulis Jurnalistik"
          subtitle="Pelajari standar dan etika penulisan untuk ekstrakurikuler jurnalistik SMA N7"
          className="mb-16"
        />

        {/* Quick Tips Alert */}
        <Alert className="mb-12">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Tips Penting:</strong> Sebelum menulis, pastikan kamu sudah memahami 5W+1H 
            (What, Who, When, Where, Why, How) dari topik yang akan dibahas.
          </AlertDescription>
        </Alert>

        {/* Writing Process */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <FileText className="h-6 w-6 mr-3 text-primary" />
            Langkah-langkah Menulis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {writingSteps.map((step, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-3xl mb-4">{step.icon}</div>
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Article Types */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <BookOpen className="h-6 w-6 mr-3 text-primary" />
            Jenis-jenis Artikel
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articleTypes.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{article.type}</CardTitle>
                  <Badge variant="outline" className="w-fit">{article.length}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {article.description}
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Contoh:</p>
                    <p className="text-sm text-muted-foreground">
                      {article.example}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Writing Structure */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Struktur Artikel</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Struktur Berita (Piramida Terbalik)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Lead (Paragraf Pembuka)</h4>
                  <p className="text-sm text-muted-foreground">
                    Informasi paling penting: what, who, when, where
                  </p>
                </div>
                <div className="border-l-4 border-primary/60 pl-4">
                  <h4 className="font-semibold">Body (Isi)</h4>
                  <p className="text-sm text-muted-foreground">
                    Detail, latar belakang, dan why/how
                  </p>
                </div>
                <div className="border-l-4 border-primary/30 pl-4">
                  <h4 className="font-semibold">Tail (Penutup)</h4>
                  <p className="text-sm text-muted-foreground">
                    Informasi tambahan dan penutup
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tips Menulis Efektif</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Gunakan kalimat aktif dan tegas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Hindari jargon dan istilah yang sulit dipahami</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Satu paragraf maksimal 3-4 kalimat</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Gunakan kutipan langsung untuk memperkuat cerita</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Periksa ejaan dan tanda baca sebelum submit</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Ethics */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <Users className="h-6 w-6 mr-3 text-primary" />
            Etika Jurnalistik
          </h2>
          
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ethicsRules.map((rule, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm">{rule}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Photo Guidelines */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <Camera className="h-6 w-6 mr-3 text-primary" />
            Panduan Foto & Visual
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Standar Foto Artikel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Resolusi minimal:</span>
                  <span className="text-sm font-medium">1200x800 px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Format file:</span>
                  <span className="text-sm font-medium">JPG, PNG</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ukuran maksimal:</span>
                  <span className="text-sm font-medium">2MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Orientasi:</span>
                  <span className="text-sm font-medium">Landscape (4:3 atau 16:9)</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tips Fotografi</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Pastikan pencahayaan yang cukup</li>
                  <li>• Fokus pada subjek utama</li>
                  <li>• Hindari foto yang blur atau gelap</li>
                  <li>• Gunakan angle yang menarik</li>
                  <li>• Sertakan caption yang informatif</li>
                  <li>• Selalu minta izin sebelum memfoto orang</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Submission Process */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Cara Submit Artikel</h2>
          
          <Card className="bg-primary-muted/50">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Persiapkan Artikel</h3>
                  <p className="text-sm text-muted-foreground">
                    Pastikan artikel sudah sesuai panduan dan dilengkapi foto
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Kirim ke Editor</h3>
                  <p className="text-sm text-muted-foreground">
                    Email ke jurnalistik.sman7@education.id dengan subject "Submit Artikel"
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Review & Publish</h3>
                  <p className="text-sm text-muted-foreground">
                    Tim editor akan review dan memberikan feedback dalam 2-3 hari
                  </p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Butuh bantuan? Hubungi pembina eskul atau ketua redaksi
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Badge variant="outline">📧 jurnalistik.sman7@education.id</Badge>
                  <Badge variant="outline">📱 WA: 0812-3456-7890</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}