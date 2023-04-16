import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';


import { AppModule } from './app.module';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    // swagger
    const options = new DocumentBuilder()
        .setTitle('Insomnia Feed')
        .setDescription('Insomnia Feed Api')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
        .build();
    const document = SwaggerModule.createDocument(app, options);

    fs.writeFileSync("./swagger-spec.json", JSON.stringify(document));

    SwaggerModule.setup('api-doc', app, document);

    // validation
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');

    await app.listen(PORT);
}
bootstrap();
