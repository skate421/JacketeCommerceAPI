import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(){
    await prisma.product.deleteMany();
    
    const product1 = await prisma.product.create({
        data: {
            name: 'Black Bomber',
            description: 'A black bomber jacket with zipper pockets',
            cost: 89.99,
            image_filename: 'images/pic1.jpg',
          },
    });

    const product2 = await prisma.product.create({
        data: {
            name: 'Roots Spring',
            description: 'A blue spring jacket with a hood and buttons',
            cost: 50.99,
            image_filename: 'images/pic2.jpg',
          },
    });

    const product3 = await prisma.product.create({
        data: {
            name: 'Brown Leather',
            description: 'A brown leather jacket with two breast pockets and grey lining',
            cost: 110.50,
            image_filename: 'images/pic3.jpg',
          },
    });

    const product4 = await prisma.product.create({
        data: {
            name: 'Blue Denim',
            description: 'A simple, blue denim jacket',
            cost: 95,
            image_filename: 'images/pic4.jpg',
          },
    });

    const product5 = await prisma.product.create({
        data: {
            name: 'Green Winter',
            description: 'A green winter jacket with yellow lining',
            cost: 130.50,
            image_filename: 'images/pic5.jpg',
          },
    });

    const product6 = await prisma.product.create({
        data: {
            name: 'Black Leather',
            description: 'A black leather jacket with zipper pockets and quilted shoulder detailing',
            cost: 160,
            image_filename: 'images/pic6.jpg',
          },
    });

    const product7 = await prisma.product.create({
        data: {
            name: 'Blue Letterman',
            description: "A dark blue letterman jacket with an 'S' patch",
            cost: 60,
            image_filename: 'images/pic7.jpg',
          },
    });

    const product8 = await prisma.product.create({
        data: {
            name: 'Pink Winter',
            description: 'A light pink winter jacket with a fur hood',
            cost: 150,
            image_filename: 'images/pic8.jpg',
          },
    });

    const product9 = await prisma.product.create({
        data: {
            name: 'Red Leather',
            description: 'A red leather jacket with quilted arm detailing',
            cost: 130,
            image_filename: 'images/pic9.jpg',
          },
    });

    const product10 = await prisma.product.create({
        data: {
            name: 'Suede cropped',
            description: 'A cropped suede jacket with buttons',
            cost: 199.99,
            image_filename: 'images/pic10.jpg',
          },
    });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });