import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
    @Get()
    @ApiExcludeEndpoint()
    getApiInfo() {
        return {
            name: 'Feedy API',
            version: '1.0.0',
            description: 'API pro platformu Feedy',
            documentation: 'https://feedy-backend.vercel.app/api',
            endpoints: {
                auth: '/auth',
                users: '/user',
                restaurants: '/restaurant',
                orders: '/order',
                couriers: '/courier'
            },
            status: 'online',
            timestamp: new Date().toISOString()
        };
    }
}