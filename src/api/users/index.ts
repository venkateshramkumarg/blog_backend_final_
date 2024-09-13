import {Hono} from 'hono'
import { PrismaClient } from '@prisma/client'

const usersGroup= new Hono()
const prisma = new PrismaClient()

usersGroup.post('/register',async(c)=>{
    try
    {
        const{user_name,password,avatar_url}=await c.req.json()
        console.log(user_name,password,avatar_url);
        
        const existing_user=await prisma.user.findUnique({
            where:{
                user_name
            },
            select:{
                user_name:true
            }
        })

        if(existing_user==null)
        {
            console.log('Creating User');
            const user=await prisma.user.create({
                data:{
                    user_name,
                    password,
                    avatar_url
                }
            })
            return c.json({message:"User Created"})
        }
        else
        {
            return c.json({message:'User name already exists'})
        }
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

usersGroup.post('/login',async(c)=>{
    try
    {
        const {user_name,password}=await c.req.json()
        const user=await prisma.user.findUnique({
            where:{
                user_name
            },
            select:{
                user_name:true,
                password:true
            }
        })
        console.log(user);
        
        if(user)
        {
            if(user.password===password)
            {
                return c.json({message:"Login Successful"})
            }
            else
            {
                return c.json({message:"Invalid Password"})
            }
        }
        else
        {
            return c.json({message:"User not found"})
        }

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

export default usersGroup
