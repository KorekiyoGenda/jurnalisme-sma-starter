import { Users, Star, Calendar, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/SectionHeading';
import articlesData from '@/data/articles.json';

export default function ClubsPage() {
  const { clubs } = articlesData;

  // Extended mock clubs data
  const allClubs = [
    ...clubs,
    {
      id: "c5",
      name: "English Club",
      description: "Mengembangkan kemampuan bahasa Inggris melalui berbagai kegiatan menarik",
      logo: "🇬🇧"
    },
    {
      id: "c6",
      name: "Sains Club",
      description: "Wadah untuk siswa yang tertarik dengan eksperimen dan penelitian sains",
      logo: "🔬"
    },
    {
      id: "c7",
      name: "Art Club",
      description: "Mengekspresikan kreativitas melalui seni lukis, gambar, dan kerajinan",
      logo: "🎨"
    },
    {
      id: "c8",
      name: "Debate Club",
      description: "Melatih kemampuan berbicara, berargumentasi, dan berpikir kritis",
      logo: "💭"
    },
    {
      id: "c9",
      name: "Cooking Club",
      description: "Belajar memasak dan mengenal berbagai kuliner nusantara",
      logo: "👨‍🍳"
    },
    {
      id: "c10",
      name: "IT Club",
      description: "Mengembangkan kemampuan programming, web design, dan teknologi",
      logo: "💻"
    }
  ];

  const clubStats = [
    { label: "Total Ekstrakurikuler", value: allClubs.length, icon: Users },
    { label: "Siswa Aktif", value: "300+", icon: Star },
    { label: "Kegiatan per Bulan", value: "25+", icon: Calendar },
    { label: "Pembina", value: "15", icon: BookOpen }
  ];

  const clubCategories = [
    {
      name: "Akademik",
      clubs: ["English Club", "Sains Club", "Debate Club"],
      color: "bg-blue-500"
    },
    {
      name: "Kreatif",
      clubs: ["Jurnalistik", "Fotografi", "Teater", "Musik", "Art Club"],
      color: "bg-purple-500"
    },
    {
      name: "Teknologi",
      clubs: ["IT Club"],
      color: "bg-green-500"
    },
    {
      name: "Life Skills",
      clubs: ["Cooking Club"],
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <SectionHeading 
          title="Ekstrakurikuler SMAN 7 Surabaya"
          subtitle="Temukan dan kembangkan bakat serta minatmu melalui berbagai kegiatan ekstrakurikuler"
          className="mb-16"
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {clubStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Kategori Ekstrakurikuler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-white font-bold text-lg">{category.clubs.length}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{category.name}</h3>
                  <div className="space-y-1">
                    {category.clubs.map((clubName, clubIndex) => (
                      <Badge key={clubIndex} variant="secondary" className="text-xs">
                        {clubName}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Clubs */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-center">Semua Ekstrakurikuler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allClubs.map((club) => (
              <Card key={club.id} className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {club.logo}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {club.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-muted-foreground text-sm text-center mb-6">
                    {club.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Anggota Aktif:</span>
                      <span className="font-medium">25-40 siswa</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Jadwal:</span>
                      <span className="font-medium">Kamis</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Waktu:</span>
                      <span className="font-medium">15:30 - 17:00</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-6" variant="outline">
                    Pelajari Lebih Lanjut
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Join CTA */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-primary-muted via-background to-primary-muted">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">Siap Bergabung?</h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-3xl mx-auto">
                Pilih ekstrakurikuler yang sesuai dengan minat dan bakatmu. Kembangkan potensi diri, 
                temukan teman baru, dan raih prestasi bersama SMA Negeri 7.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <div className="text-2xl">📝</div>
                  <h4 className="font-semibold">Pendaftaran</h4>
                  <p className="text-sm text-muted-foreground">Daftar melalui guru pembina atau OSIS</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl">🎯</div>
                  <h4 className="font-semibold">Pilih Minat</h4>
                  <p className="text-sm text-muted-foreground">Sesuaikan dengan bakat dan passion mu</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl">🏆</div>
                  <h4 className="font-semibold">Raih Prestasi</h4>
                  <p className="text-sm text-muted-foreground">Ikuti kompetisi dan lomba tingkat nasional</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  <Users className="mr-2 h-4 w-4" />
                  Hubungi OSIS
                </Button>
                <Button variant="outline" size="lg">
                  Download Formulir
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}