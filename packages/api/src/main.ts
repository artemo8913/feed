import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { createProxyMiddleware } from 'http-proxy-middleware';

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

    const API_SERVICE_URL = "http://localhost:8000";

    // Proxy endpoints
    app.use('/api/v1', createProxyMiddleware({
      target: API_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: {
        // [`^/api/v1`]: '/api/v1',
      },
      onProxyRes: (proxyRes, _req, _res) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3002';
        proxyRes.headers['Access-Control-Allow-Credentials'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS, POST, PUT, PATCH, DELETE';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers';
          },
    }));

    await app.listen(PORT);
}
bootstrap();
