import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@elaa.com' },
    update: {},
    create: {
      email: 'admin@elaa.com',
      password: await hash('Admin@123', 10),
      role: 'ADMIN'
    }
  });

  if (admin) {
    console.log(`✅ Admin account ${admin.email} successfully created/updated`);
  }

  // Create default supplier
  const supplier = await prisma.supplier.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Elaa Beauty Supplies',
      email: 'supplier@elaa.com',
      phone: '+33123456789',
      address: '123 Beauty Street, Paris, France'
    }
  });
  
  console.log(`✅ Default supplier ${supplier.name} created/updated`);

  // Create brands
  const brandNames = [
    'Elaa Beauty',
    'Luxe Cosmetics',
    'Natural Glow',
    'Paris Elegance',
    'Moroccan Magic'
  ];

  for (let i = 0; i < brandNames.length; i++) {
    await prisma.brand.upsert({
      where: { id: i + 1 },
      update: { name: brandNames[i] },
      create: { name: brandNames[i] }
    });
  }
  
  console.log('✅ Brands created/updated');

  // Create makeup categories
  const categoryData = [
    { name: 'Fond de Teint', description: 'Foundations and base makeup' },
    { name: 'Rouge à Lèvres', description: 'Lipsticks and lip products' },
    { name: 'Palettes', description: 'Eyeshadow and makeup palettes' },
    { name: 'Mascara', description: 'Mascaras and eye products' },
    { name: 'Blush', description: 'Blushes and cheek products' },
    { name: 'Highlighter', description: 'Highlighters and illuminators' }
  ];

  for (let i = 0; i < categoryData.length; i++) {
    await prisma.category.upsert({
      where: { id: i + 1 },
      update: { name: categoryData[i].name, description: categoryData[i].description },
      create: { name: categoryData[i].name, description: categoryData[i].description }
    });
  }
  
  console.log('✅ Categories created/updated');

  // Get created categories and brands for reference
  const createdCategories = await prisma.category.findMany();
  const createdBrands = await prisma.brand.findMany();
  
  // Create products for each category
  for (const category of createdCategories) {
    // Create 10 products for each category
    for (let i = 1; i <= 10; i++) {
      const brandIndex = Math.floor(Math.random() * createdBrands.length);
      const brand = createdBrands[brandIndex];
      
      // Generate product name based on category
      let productName = '';
      let productDescription = '';
      let productPrice = 0;
      let productColor = '';
      
      switch(category.name) {
        case 'Fond de Teint':
          productName = `${brand.name} Perfect Skin Foundation ${i}`;
          productDescription = `Lightweight foundation with medium to full coverage. Shade ${i}`;
          productPrice = 99.99 + (i * 5);
          productColor = ['Ivory', 'Beige', 'Sand', 'Tan', 'Caramel', 'Amber', 'Honey', 'Chestnut', 'Espresso', 'Ebony'][i-1];
          break;
        case 'Rouge à Lèvres':
          productName = `${brand.name} Velvet Matte Lipstick ${i}`;
          productDescription = `Long-lasting matte lipstick with hydrating formula. Shade ${i}`;
          productPrice = 79.99 + (i * 3);
          productColor = ['Red', 'Pink', 'Coral', 'Nude', 'Mauve', 'Berry', 'Plum', 'Brown', 'Orange', 'Burgundy'][i-1];
          break;
        case 'Palettes':
          productName = `${brand.name} Eye Palette Collection ${i}`;
          productDescription = `Eyeshadow palette with 12 complementary shades. Collection ${i}`;
          productPrice = 149.99 + (i * 10);
          productColor = ['Neutral', 'Smokey', 'Sunset', 'Desert', 'Ocean', 'Forest', 'Berry', 'Metallic', 'Pastel', 'Glitter'][i-1];
          break;
        case 'Mascara':
          productName = `${brand.name} Volume Mascara ${i}`;
          productDescription = `Volumizing and lengthening mascara. Formula ${i}`;
          productPrice = 69.99 + (i * 4);
          productColor = ['Black', 'Brown', 'Blue', 'Purple', 'Waterproof Black', 'Waterproof Brown', 'Fiber Black', 'Curling Black', 'Lengthening Black', 'Volume Black'][i-1];
          break;
        case 'Blush':
          productName = `${brand.name} Satin Blush ${i}`;
          productDescription = `Silky smooth blush for a natural flush. Shade ${i}`;
          productPrice = 89.99 + (i * 5);
          productColor = ['Peach', 'Pink', 'Coral', 'Rose', 'Mauve', 'Berry', 'Apricot', 'Terracotta', 'Plum', 'Shimmer Pink'][i-1];
          break;
        case 'Highlighter':
          productName = `${brand.name} Glow Highlighter ${i}`;
          productDescription = `Illuminating highlighter for a radiant glow. Shade ${i}`;
          productPrice = 109.99 + (i * 7);
          productColor = ['Gold', 'Champagne', 'Rose Gold', 'Bronze', 'Pearl', 'Silver', 'Holographic', 'Copper', 'Pink Gold', 'Opal'][i-1];
          break;
        default:
          productName = `${brand.name} Beauty Product ${i}`;
          productDescription = `High-quality beauty product. Version ${i}`;
          productPrice = 99.99;
          productColor = 'Universal';
      }
      
      // Create the product
      const product = await prisma.product.create({
        data: {
          name: productName,
          description: productDescription,
          price: productPrice,
          color: productColor,
          supplierId: supplier.id,
          categoryId: category.id,
          brandId: brand.id,
          // Create a placeholder image for each product
          images: {
            create: [
              {
                url: `/assets/images/placeholder-${category.name.toLowerCase().replace(/\s+/g, '-')}.png`,
                isMain: true
              }
            ]
          },
          // Add some sizes
          sizes: {
            create: [
              {
                name: 'Standard',
                stock: Math.floor(Math.random() * 50) + 10,
                sku: `${category.name.substring(0, 3).toUpperCase()}-${i}-STD`
              }
            ]
          }
        }
      });
      
      console.log(`✅ Created product: ${product.name}`);
    }
  }
  
  console.log('✅ All products created successfully!');
}

// Execute the main function
console.log('Starting seed process...');
main()
  .then(() => {
    console.log('✅ Seed completed successfully!');
  })
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Disconnecting from database...');
    await prisma.$disconnect();
    console.log('Database connection closed.');
  });