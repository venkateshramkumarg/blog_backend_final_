import {Hono} from 'hono'
import { PrismaClient } from '@prisma/client'

const commentsGroup= new Hono()
const prisma = new PrismaClient()

commentsGroup.post('/create',async(c)=>{
    try
    {
        const{content,user_name,post_id}=await c.req.json()
        const comment=await prisma.comment.create({
            data:{
                content,
                user_name,
                post_id,
            }
        })

        return c.json({message:"Comment Created"})
    }
    catch(e)
    {
        return c.json({error:e})
    }
    finally
    {
        await prisma.$disconnect()
    }
})

commentsGroup.get('/all',async(c)=>{
    try
    {
        const {post_id}=await c.req.json()
        const comments=await prisma.comment.findMany({
            where:{
                post_id
            },
            select:{
                id:true,
                content:true,
                user_name:true,
                User:{
                    select:{
                        avatar_url: true
                    }
                }
            },
            orderBy:{
                created_at:"desc"
            }
        })
        return c.json(comments)
    }
    catch(e)
    {
        return c.json({error:e})
    }
    finally
    {
        await prisma.$disconnect()
    }
})

export default commentsGroup