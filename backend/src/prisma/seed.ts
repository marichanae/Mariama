import { PrismaClient, ProductType, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Catégories de base
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Figurines maudites' },
      update: {},
      create: { name: 'Figurines maudites' },
    }),
    prisma.category.upsert({
      where: { name: 'Blu-ray possédés' },
      update: {},
      create: { name: 'Blu-ray possédés' },
    }),
    prisma.category.upsert({
      where: { name: 'Jeux interdits' },
      update: {},
      create: { name: 'Jeux interdits' },
    }),
    prisma.category.upsert({
      where: { name: 'Fanzines numériques' },
      update: {},
      create: { name: 'Fanzines numériques' },
    }),
    prisma.category.upsert({
      where: { name: 'Classiques gothiques' },
      update: {},
      create: { name: 'Classiques gothiques' },
    }),
  ]);

  const byName = (name: string) => categories.find((c) => c.name === name)!;

  // Produits de démonstration
  const productsData = [
    {
      name: 'Figurine – La Dame du Grenier',
      description:
        'Une figurine en résine représentant une silhouette encapuchonnée qui semble changer de posture selon la lumière.',
      price: 39.9,
      type: ProductType.PHYSICAL,
      category: 'Figurines maudites',
    },
    {
      name: 'Figurine – Le Marionnettiste sans visage',
      description:
        'Une marionnette articulée au visage lisse, livrée avec ses fils et son support en bois sombre.',
      price: 44.9,
      type: ProductType.PHYSICAL,
      category: 'Figurines maudites',
    },
    {
      name: 'Blu-ray – Nuit Sans Lune (édition restaurée)',
      description:
        'Un slasher atmosphérique des années 80, restauré en haute définition, avec commentaires audio et making-of occulte.',
      price: 24.9,
      type: ProductType.PHYSICAL,
      category: 'Blu-ray possédés',
    },
    {
      name: 'Blu-ray – L’Appartement 404',
      description:
        'Found footage claustrophobe entièrement tourné dans un seul appartement, entre grincements et voix murmurées.',
      price: 19.9,
      type: ProductType.PHYSICAL,
      category: 'Blu-ray possédés',
    },
    {
      name: 'Jeu de société – Rituel de Minuit',
      description:
        'Un jeu coopératif où les joueurs doivent mener un rituel à bien avant que la dernière bougie ne s’éteigne.',
      price: 49.9,
      type: ProductType.PHYSICAL,
      category: 'Jeux interdits',
    },
    {
      name: 'Jeu vidéo – Corridor.exe (clé dématérialisée)',
      description:
        'Walking-sim minimaliste dans un couloir infini, chaque retour en arrière change imperceptiblement votre environnement.',
      price: 14.9,
      type: ProductType.DIGITAL,
      category: 'Jeux interdits',
    },
    {
      name: 'Fanzine PDF – Dossiers de la Maison',
      description:
        'Un fanzine numérique regroupant témoignages, plans et photos annotées de la Petite Maison de l’Épouvante.',
      price: 5.9,
      type: ProductType.DIGITAL,
      category: 'Fanzines numériques',
    },
    {
      name: 'Recueil EPUB – Contes pour ne pas dormir',
      description:
        'Une collection de dix nouvelles gothiques, illustrées, à lire dans le noir avec une lampe de poche.',
      price: 8.9,
      type: ProductType.DIGITAL,
      category: 'Fanzines numériques',
    },
    {
      name: 'Coffret – Classiques gothiques vol. I',
      description:
        'Un coffret regroupant trois films muets restaurés, accompagnés d’un livret critique et de photos d’archives.',
      price: 59.9,
      type: ProductType.PHYSICAL,
      category: 'Classiques gothiques',
    },
  ];

  for (const data of productsData) {
    const category = byName(data.category);
    await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        type: data.type,
        categoryId: category.id,
      },
    });
  }

  // Optionnel : créer un utilisateur admin de démo s’il n’existe pas
  await prisma.user.upsert({
    where: { email: 'admin@epouvante.local' },
    update: {},
    create: {
      email: 'admin@epouvante.local',
      password: '$2b$10$abcdefghijklmnopqrstuv', // à remplacer par un vrai hash si besoin
      role: Role.ADMIN,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
