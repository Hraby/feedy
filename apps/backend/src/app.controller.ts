import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
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