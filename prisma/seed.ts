import { prisma } from "../src/lib/prisma";
import { Role } from "../generated/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // 1. Create Default Categories
  const categories = [
    { name: "Apartment" },
    { name: "House" },
    { name: "Studio" },
    { name: "Duplex" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });
  }
  console.log("Categories seeded successfully.");

  // 2. Create Default Admin
  const adminEmail = "admin@rentnest.com";
  const hashedPassword = await bcrypt.hash("AdminRentNest2026!", 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      status: "active",
    },
    create: {
      name: "System Admin",
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
      status: "active",
    },
  });
  console.log("Admin account seeded:", admin.email);

  // 3. Create Sample Landlord
  const landlordEmail = "landlord@rentnest.com";
  const landlordPassword = await bcrypt.hash("Landlord123!", 12);
  const landlord = await prisma.user.upsert({
    where: { email: landlordEmail },
    update: {},
    create: {
      name: "John Landlord",
      email: landlordEmail,
      password: landlordPassword,
      role: Role.LANDLORD,
      status: "active",
    },
  });
  console.log("Landlord account seeded:", landlord.email);

  // 4. Create Sample Tenant
  const tenantEmail = "tenant@rentnest.com";
  const tenantPassword = await bcrypt.hash("Tenant123!", 12);
  const tenant = await prisma.user.upsert({
    where: { email: tenantEmail },
    update: {},
    create: {
      name: "Jane Tenant",
      email: tenantEmail,
      password: tenantPassword,
      role: Role.TENANT,
      status: "active",
    },
  });
  console.log("Tenant account seeded:", tenant.email);

  // 5. Create a Property for testing
  const categoryApartment = await prisma.category.findUnique({
    where: { name: "Apartment" },
  });

  if (categoryApartment && landlord) {
    const propertyTitle = "Cozy 2-Bedroom Apartment in Dhaka";
    const existingProperty = await prisma.property.findFirst({
      where: { title: propertyTitle },
    });

    if (!existingProperty) {
      await prisma.property.create({
        data: {
          title: propertyTitle,
          description: "A beautiful cozy 2-bedroom apartment with modern amenities in the heart of the city.",
          location: "Dhaka, Bangladesh",
          price: 15000,
          amenities: ["WiFi", "AC", "Kitchen", "Security"],
          isAvailable: true,
          landlordId: landlord.id,
          categoryId: categoryApartment.id,
        },
      });
      console.log("Sample property seeded.");
    }
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
