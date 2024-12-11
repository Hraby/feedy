import { UnauthorizedException} from "@nestjs/common";

export const authContext = ({ req }) => {
    if(req.headers?.authorization){
        return true;
    }
    throw new UnauthorizedException();
}