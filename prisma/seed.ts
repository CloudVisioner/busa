import { PrismaClient, type Prisma } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('Seeding...')

  const hashedPassword = await bcrypt.hash('BusaAdmin2025', 10)
  await prisma.user.upsert({
    where: { email: 'admin@busa.uz' },
    update: {},
    create: { email: 'admin@busa.uz', password: hashedPassword, role: 'SUPER_ADMIN' },
  })
  console.log('✓ Admin user created')

  const mentorPassword = await bcrypt.hash('BusaMentor2025', 10)
  await prisma.user.upsert({
    where: { email: 'mentor@busa.uz' },
    update: {},
    create: { email: 'mentor@busa.uz', password: mentorPassword, role: 'ADMIN' },
  })
  console.log('✓ Mentor user created')

  const events: Prisma.EventUncheckedCreateInput[] = [
    {
      title: "Navro'z 2025",
      slug: 'navroz-2025',
      date: '2025-03-21T12:00:00.000Z',
      location: 'Busan PNUK',
      description: "BUSA ning yillik Navro'z bayrami",
      coverPhoto: 'https://placeholder.com/navroz.jpg',
      type: 'MADANIY',
      photos: [],
    },
    {
      title: 'Summer Trip 2025',
      slug: 'summer-trip-2025',
      date: '2025-06-15T12:00:00.000Z',
      location: 'Geoje & Busan Coast',
      description: 'Yozgi sayohat',
      coverPhoto: 'https://placeholder.com/trip.jpg',
      type: 'TRIP',
      photos: [],
    },
    {
      title: 'BUSA New Year Gala',
      slug: 'new-year-gala-2024',
      date: '2024-12-28T12:00:00.000Z',
      location: 'Busan',
      description: 'Yangi yil bayrami',
      coverPhoto: 'https://placeholder.com/gala.jpg',
      type: 'MADANIY',
      photos: [],
    },
    {
      title: 'Mini-Football Cup 2024',
      slug: 'football-cup-2024',
      date: '2024-05-12T12:00:00.000Z',
      location: 'Busan Sports Center',
      description: 'Mini futbol turniri',
      coverPhoto: 'https://placeholder.com/football.jpg',
      type: 'SPORT',
      photos: [],
    },
    {
      title: 'CV & Interview Workshop',
      slug: 'cv-workshop-2024',
      date: '2024-01-18T12:00:00.000Z',
      location: 'PNUK',
      description: 'CV va intervyu tayyorlash',
      coverPhoto: 'https://placeholder.com/workshop.jpg',
      type: 'WORKSHOP',
      photos: [],
    },
  ]

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    })
  }
  console.log('✓ Events seeded')

  const projects = [
    {
      title: 'Sayohat (Trip)',
      slug: 'sayohat-trip',
      description: "Koreyaning tarixiy va go'zal maskanlariga birgalikda unutilmas sayohatlar",
      coverPhoto: 'https://placeholder.com/trip.jpg',
      photos: [],
      status: 'ACTIVE',
      members: [],
      isFeatured: true,
    },
    {
      title: 'Speaking Class',
      slug: 'speaking-class',
      description: "Ingliz va Koreys tillarida erkin so'zlashish ko'nikmalarini rivojlantiring",
      coverPhoto: 'https://placeholder.com/speaking.jpg',
      photos: [],
      status: 'ACTIVE',
      members: [],
      isFeatured: false,
    },
    {
      title: 'Korean Club',
      slug: 'korean-club',
      description: "Koreya madaniyati va urf-odatlarini chuqur o'rganish",
      coverPhoto: 'https://placeholder.com/korean.jpg',
      photos: [],
      status: 'ACTIVE',
      members: [],
      isFeatured: false,
    },
    {
      title: 'Book Club',
      slug: 'book-club',
      description: 'Dunyoqarashni kengaytiruvchi asarlar mutolaasi',
      coverPhoto: 'https://placeholder.com/book.jpg',
      photos: [],
      status: 'ACTIVE',
      members: [],
      isFeatured: false,
    },
    {
      title: 'BUSA Academy',
      slug: 'busa-academy',
      description: "Soft skills va shaxsiy rivojlanish bo'yicha mahorat darslari",
      coverPhoto: 'https://placeholder.com/academy.jpg',
      photos: [],
      status: 'ACTIVE',
      members: [],
      isFeatured: false,
    },
    {
      title: 'Tech Talk',
      slug: 'tech-talk',
      description: 'Zamonaviy texnologiyalar va IT trendlari haqida ekspertlar suhbati',
      coverPhoto: 'https://placeholder.com/tech.jpg',
      photos: [],
      status: 'ACTIVE',
      members: [],
      isFeatured: false,
    },
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project as unknown as Prisma.ProjectUncheckedCreateInput,
    })
  }
  console.log('✓ Projects seeded')

  const articles = [
    {
      title: 'D-2 vizasini qanday uzaytirish mumkin',
      slug: 'd-2-vizasini-qanday-uzaytirish-mumkin',
      content: "D-2 viza uzaytirish haqida to'liq qo'llanma...",
      visaType: 'D2' as const,
      readTime: 5,
      description: 'Semestr yakunida hujjatlarni qanday tayyorlash',
      isOutdated: false,
      author: 'Admin',
    },
    {
      title: 'E-7 uchun kerakli hujjatlar',
      slug: 'e-7-uchun-kerakli-hujjatlar',
      content: "E-7 viza uchun kerakli hujjatlar ro'yxati...",
      visaType: 'E7' as const,
      readTime: 4,
      description: 'Kompaniya shartnomasi va boshqa hujjatlar',
      isOutdated: false,
      author: 'Admin',
    },
    {
      title: "D-10 dan E-7 ga o'tish mumkinmi?",
      slug: 'd-10-dan-e-7-ga-otish-mumkinmi',
      content: "D-10 dan E-7 ga o'tish jarayoni...",
      visaType: 'D10' as const,
      readTime: 3,
      description: "Visa o'zgartirish jarayoni va talablar",
      isOutdated: false,
      author: 'Admin',
    },
  ]

  for (const article of articles) {
    await prisma.visaArticle.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    })
  }
  console.log('✓ Visa articles seeded')

  const team = [
    {
      name: 'Azamat Karimov',
      role: 'Prezident',
      year: 2025,
      nimaqildi: 'BUSA platformasini yaratdi va hamjamiyatni raqamlashtirdi',
      quote: '"Jamoa kuchi individual qiyinchiliklarni yengadi"',
      order: 1,
    },
    {
      name: 'Madina Islomova',
      role: 'Vice President',
      year: 2025,
      nimaqildi: "Tadbirlarni tashkil etdi va a'zolar sonini ikki baravar oshirdi",
      quote: '"Birgalikda biz ko\'proq narsaga erishamiz"',
      order: 2,
    },
    {
      name: "Jahongir To'raev",
      role: 'Project Manager',
      year: 2025,
      nimaqildi: 'Speaking Class va Book Club loyihalarini boshqardi',
      quote: '"Har bir loyiha yangi imkoniyat"',
      order: 3,
    },
    {
      name: 'Shahnoza Abduqodirova',
      role: 'Design Lead',
      year: 2025,
      nimaqildi: "BUSA vizual identifikatsiyasini yaratdi",
      quote: '"Dizayn - bu muammolarni hal qilish san\'ati"',
      order: 4,
    },
  ]

  for (const [i, member] of team.entries()) {
    await prisma.teamMember.upsert({
      where: { id: `team-${i + 1}` },
      update: {},
      create: { id: `team-${i + 1}`, ...member },
    })
  }
  console.log('✓ Team members seeded')

  const timeline = [
    {
      year: '2021',
      title: 'Asos solindi',
      description: "5 nafar talaba Busanda ilk bor yig'ildi",
      presidentName: 'Jamal Khudaybergenov',
      achievements: ["BUSA tashkil etildi", 'Telegram guruhi yaratildi', 'Ilk 5 a\'zo'],
    },
    {
      year: '2022',
      title: "Ilk Navro'z",
      description: "50 dan ortiq ishtirokchi bilan birinchi Navro'z",
      presidentName: 'Jamal Khudaybergenov',
      achievements: ["50+ a'zo", 'Book Club tashkil etildi', 'Telegram 100 a\'zo'],
    },
    {
      year: '2023',
      title: 'Masshtab kengayishi',
      description: '500 Telegram a\'zosi va Speaking Club',
      presidentName: 'Jamal Khudaybergenov',
      achievements: ["500 Telegram a'zosi", 'Speaking Club', 'Birinchi sayohat'],
    },
    {
      year: '2024',
      title: "Raqamli o'sish",
      description: '1,000 Telegram va 5,000 Instagram',
      presidentName: 'Azamat Karimov',
      achievements: ['1,000 Telegram', '5,000 Instagram', 'Koreys tili kurslari'],
    },
    {
      year: '2025',
      title: 'Kelajak platformasi',
      description: 'BUSA platformasi ishga tushdi',
      presidentName: 'Azamat Karimov',
      achievements: ['BUSA platform', 'Viza bo\'limi', '18,155 Uzbek in Korea'],
    },
  ]

  for (const entry of timeline) {
    await prisma.timelineEntry.create({ data: entry }).catch(() => {})
  }
  console.log('✓ Timeline seeded')

  console.log('✅ Database seeded successfully')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
