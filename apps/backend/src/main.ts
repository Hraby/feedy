import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const cors = {
    origin: 'http://localhost:3000',
    credentials: true,
  };

  const config = new DocumentBuilder()
    .setTitle("Feedy API")
    .setDescription("API for food delivery platform Feedy")
    .setVersion("1.0")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory)

  app.enableCors(cors);
  await app.listen(4000);
}
bootstrap();