import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourierDto } from './dto/create-courier.dto';
import { CourierStatus, User } from '@prisma/client';

@Injectable()
export class CourierService {
    constructor(private readonly prisma: PrismaService) {}

    async requestCourier(dto: CreateCourierDto, user: User) {
        const existingProfile = await this.prisma.courierProfile.findUnique({
            where: { userId: user.id }
        });
    
        if (existingProfile) {
            return this.prisma.courierProfile.update({
                where: { userId: user.id },
                data: {
                    language: dto.language,
                    city: dto.city,
                    vehicle: dto.vehicle,
                    status: "Offline",
                    approvalStatus: "Pending",
                    dateBirth: new Date(dto.dateBirth),
                },
            });
        } else {
            return this.prisma.courierProfile.create({
                data: {
                    userId: user.id,
                    language: dto.language,
                    city: dto.city,
                    vehicle: dto.vehicle,
                    status: "Offline",
                    approvalStatus: "Pending",
                    dateBirth: new Date(dto.dateBirth),
                },
            });
        }
    }

    async approveCourier(id: string, approve: boolean){
        return this.prisma.courierProfile.update({
            where: { id },
            data: {
              approvalStatus: approve ? "Approved" : "Rejected",
            },
        });
    }

    async getCouriers(){
        return this.prisma.courierProfile.findMany({
            include: {
                user: true,
            }
        })
    }

    async updateStatus(id: string, status: CourierStatus){
        return this.prisma.courierProfile.update({
            where: {
                userId: id,
            },
            data: {
                status: status,
            }
        })
    }
}