import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourierDto } from './dto/create-courier.dto';
import { ApprovalStatus, CourierStatus, Role, User } from '@prisma/client';

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

    async approveCourier(id: string, status: ApprovalStatus){
        const courier = await this.prisma.courierProfile.findFirst({
            where: {
                id: id
            },
            include: {
                user: true
            }
        })

        const user = await this.prisma.user.findUnique({
            where: { id: courier.user.id },
            select: { role: true },
        });
          
        if (!user) {
            throw new Error("User not found");
        }
          
        if (status == "Approved") {
            if (!user.role.includes(Role.Courier)) {
                await this.prisma.user.update({
                    where: { id: courier.user.id },
                    data: {
                        role: {
                            push: Role.Courier,
                        },
                    },
                });
            }
            } else {
            if (user.role.includes(Role.Courier)) {
                await this.prisma.user.update({
                    where: { id: courier.user.id },
                    data: {
                        role: {
                            set: user.role.filter(r => r !== Role.Courier),
                        },
                    },
                });
            }
        }

        return this.prisma.courierProfile.update({
            where: { id },
            data: {
                approvalStatus: status,
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