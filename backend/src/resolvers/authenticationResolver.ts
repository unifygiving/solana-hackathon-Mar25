import userService from '../service/userService'
import { MutationLoginArgs, MutationResolvers, AuthPayload, RoleType, User } from '../generated/graphql'
import { valueToEnum } from '../utils/valueToEnum'
import { withAuth, falseFunc, trueFunc, inRole, any, all } from './authorization'
import { GraphQLError } from 'graphql'

const resolver = {
    Mutation: {
        login: withAuth([trueFunc],
            async (_parent: any, args: MutationLoginArgs) => {
                try {
                    // Use type assertion to tell TypeScript what type result is
                    const result = await userService.login(args.email, args.password) as {
                        user: { id: number; role: string; email: string; [key: string]: any };
                        token: string;
                    } | null;
                    
                    // Check if result exists before accessing its properties
                    if (!result) {
                        throw new GraphQLError('Authentication failed', {
                            extensions: { code: 'UNAUTHENTICATED' }
                        });
                    }
                    
                    const authResult: AuthPayload = {
                        user: {
                            ...result.user,
                            id: result.user.id,
                            role: valueToEnum(RoleType, result.user.role),
                            email: result.user.email // Ensure email is included
                        },
                        token: result.token
                    }
                    return authResult;
                } catch (error) {
                    throw new GraphQLError('Authentication failed', {
                        extensions: { code: 'UNAUTHENTICATED' }
                    });
                }
            }),
        logout: withAuth([trueFunc],
            async (_parent, _args, contextValue) => {
                console.log("LOGOUT");
                return true
            }
        )
    }
}

export default resolver