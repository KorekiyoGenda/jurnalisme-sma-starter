import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/SectionHeading';
import articlesData from '@/data/articles.json';
import { dateID } from '@/lib/date';
import { diffDaysID, parseIDDate, todayID } from '@/lib/date-safe'


export default function EventsPage() {
  const { events } = articlesData;

  // Extended mock events for demonstration
  const allEvents = [
    ...events,
    {
      id: "e4",
      title: "Workshop Fotografi Jurnalistik",
      date: "2025-03-10",
      location: "Lab Multimedia",
      description: "Pelatihan teknik fotografi untuk mendukung kegiatan jurnalistik sekolah"
    },
    {
      id: "e5",
      title: "Seminar Menulis Kreatif",
      date: "2025-03-15",
      location: "Aula Sekolah",
      description: "Menghadirkan penulis profesional untuk berbagi tips menulis kreatif"
    },
    {
      id: "e6",
      title: "Peluncuran Majalah Sekolah",
      date: "2025-03-25",
      location: "Perpustakaan",
      description: "Launching majalah sekolah edisi terbaru hasil karya siswa"
    },
    {
      id: "e7",
      title: "Lomba Jurnalistik Antar Kelas",
      date: "2025-04-05",
      location: "Ruang Kelas",
      description: "Kompetisi menulis artikel dan reportase antar kelas untuk semua tingkat"
    },
    {
      id: "e8",
      title: "Study Tour Media Partner",
      date: "2025-04-12",
      location: "Media Lokal",
      description: "Kunjungan ke media lokal untuk belajar langsung proses produksi berita"
    }
  ];

  const formatDate = (dateString: string) => {
    return {
      day:      dateID.day2(dateString),
      month:    dateID.monthShort(dateString),
      weekday:  dateID.weekdayLong(dateString),
      fullDate: dateID.fullLong(dateString),
    };
  };

  const getEventStatus = (dateString: string) => {
    const d = diffDaysID(dateString)
    if (d < 0)  return { status: 'Selesai',  variant: 'secondary' as const }
    if (d === 0) return { status: 'Hari ini', variant: 'destructive' as const }
    if (d <= 7)  return { status: 'Segera',   variant: 'default' as const }
    return { status: 'Mendatang', variant: 'outline' as const }
  }

  // Separate upcoming and past events
  const today = todayID()
  const upcomingEvents = allEvents.filter(e => parseIDDate(e.date) >= today)
  const pastEvents     = allEvents.filter(e => parseIDDate(e.date) <  today)

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <SectionHeading 
          title="Agenda & Kegiatan"
          subtitle="Jangan lewatkan berbagai kegiatan menarik di SMA Negeri 7"
          className="mb-16"
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{upcomingEvents.length}</div>
              <p className="text-sm text-muted-foreground">Event Mendatang</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{pastEvents.length}</div>
              <p className="text-sm text-muted-foreground">Event Selesai</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">12</div>
              <p className="text-sm text-muted-foreground">Event Per Tahun</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <p className="text-sm text-muted-foreground">Total Peserta</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <Calendar className="h-6 w-6 mr-3 text-primary" />
              Event Mendatang
            </h2>
            
            <div className="space-y-6">
              {upcomingEvents.map((event) => {
                const dateInfo = formatDate(event.date);
                const { status, variant } = getEventStatus(event.date);
                
                return (
                  <Card key={event.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                        {/* Date */}
                        <div className="flex-shrink-0 text-center">
                          <div className="bg-primary text-white rounded-lg p-4 w-20">
                            <div className="text-2xl font-bold">{dateInfo.day}</div>
                            <div className="text-sm uppercase">{dateInfo.month}</div>
                          </div>
                          <Badge variant={variant} className="mt-2 text-xs">
                            {status}
                          </Badge>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="mb-3">
                            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                            <p className="text-muted-foreground">{event.description}</p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{dateInfo.fullDate}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>09:00 - 15:00</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action */}
                        <div className="flex-shrink-0">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="h-4 w-4 mr-1" />
                            <span>50+ peserta</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <Clock className="h-6 w-6 mr-3 text-muted-foreground" />
              Event Sebelumnya
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => {
                const dateInfo = formatDate(event.date);
                
                return (
                  <Card key={event.id} className="opacity-75 hover:opacity-100 transition-opacity">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="bg-muted text-muted-foreground rounded-lg p-3 w-16 mx-auto">
                          <div className="text-xl font-bold">{dateInfo.day}</div>
                          <div className="text-xs uppercase">{dateInfo.month}</div>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold mb-2 text-center">{event.title}</h3>
                      <p className="text-muted-foreground text-sm text-center mb-4">
                        {event.description}
                      </p>
                      
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center justify-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{event.location}</span>
                        </div>
                        <Badge variant="secondary" className="w-full justify-center">
                          Selesai
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="mt-16">
          <Card className="bg-primary-muted/50">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ingin Bergabung?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Tertarik untuk mengikuti kegiatan-kegiatan menarik dari ekstrakurikuler jurnalistik? 
                Bergabunglah dengan kami dan kembangkan potensimu!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge variant="outline" className="text-sm py-2 px-4">
                  📧 jurnalistik.sman7@education.id
                </Badge>
                <Badge variant="outline" className="text-sm py-2 px-4">
                  📞 (021) 123-4567
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}