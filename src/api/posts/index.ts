import {Hono} from 'hono'
import { PrismaClient } from '@prisma/client'

const postsGroup= new Hono()
const prisma = new PrismaClient()

postsGroup.post('/create', async (c) => {
    try {
        const { title, content, user_name,image} = await c.req.json();
        console.log(title, content, user_name);
        const post = await prisma.post.create({
            data: {
                title,
                content,
                image:image,
                likes: 0,
                dislikes: 0,
                User: {
                    connect: {
                        user_name: user_name
                    }
                }
            }
        });
        return c.json("Post Created");
    } catch (e) {
        console.log(e);
        return c.json({ error: e });
    } finally {
        await prisma.$disconnect();
    }
});

postsGroup.post('limit/all', async (c) => {
    try {
        let hasMany = true;
        let { page, limit } = await c.req.json();
        const postslength = await prisma.post.count();
        if (postslength <= page * limit) {
            limit = postslength - (page - 1) * limit;
            hasMany=false;
            
        }
        if (limit <=1) 
        {
            hasMany = false;
        }

        const posts = await prisma.post.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                user_name: true,
                image:true,
                likes: true,
                dislikes: true,
                created_at: true,
                comments: true,
                liked_by: true,
                disliked_by: true,
                User: {
                    select: {
                        avatar_url: true
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            },
            skip: (page - 1) *2,
            take:2
        });

        if (posts.length === 0) {
            return c.json({posts, hasMany: false});
        }
        return c.json({ posts, hasMany: hasMany });

    } catch (e) {
        return c.json({ error: e });
    } finally {
        await prisma.$disconnect();
    }
});

postsGroup.get('/all',async(c)=>{
    try
    {
        const posts=await prisma.post.findMany({
            select:{
                id:true,
                title:true,
                content:true,
                user_name:true,
                image:true,
                likes:true,
                dislikes:true,
                created_at:true,
                liked_by:true,
                disliked_by:true,
                User:{
                    select:{
                        avatar_url:true
                    }
                }
            },
            orderBy:{
                created_at:"desc"
            }
        })
        return c.json(posts)
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

postsGroup.get('/post/:id',async(c)=>{

    try
    {
        const {id}=c.req.param()
        const post=await prisma.post.findUnique({
            where:{
                id:Number(id)
            },
            select:{
                id:true,
                title:true,
                content:true,
                user_name:true,
                image:true,
                likes:true,
                dislikes:true,
                created_at:true,
                liked_by:true,
                disliked_by:true,
                User:{
                    select:{
                        avatar_url:true
                    }
                },
                comments:{
                    select:{
                        id:true,
                        content:true,
                        user_name:true,
                        created_at:true,
                        User:{
                            select:{
                                avatar_url:true
                            }
                        }
                    },
                    orderBy:{
                        created_at:"desc"
                    }
                }
            }
        })
        return c.json(post)
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

postsGroup.post('/increment/like',async(c)=>{
    try
    {
        const {post_id,user_name}=await c.req.json()
        const post=await prisma.post.update({
            where:{
                id:post_id
            },
            data:{
                likes:{
                    increment:1
                },
                liked_by: {
                    connect: {
                        user_name: user_name
                    }
                }
            }
        })
        return c.json({message:"Post Liked"})
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

postsGroup.post('/decrement/like',async(c)=>{
    try
    {
        console.log("hello1")
        const {post_id,user_name}=await c.req.json()
        const post=await prisma.post.update({
            where:{
                id:post_id
            },
            data:{
                likes:{
                    decrement:1
                },
                liked_by: {
                    disconnect: {
                        user_name: user_name
                    }
                }
            }
        })
        return c.json({message:"Post Like Decremented"})
    }
    catch(e)
    {
        return c.json({error:"Error"})
    }
    finally
    {
        await prisma.$disconnect()
    }
})

postsGroup.post('increment/dislike',async(c)=>{
    try
    {
        const {post_id,user_name}=await c.req.json()
        const post=await prisma.post.update({
            where:{
                id:post_id
            },
            data:{
                dislikes:{
                    increment:1
                },
                disliked_by:{
                    connect:{
                        user_name:user_name
                    }
                }
            }
        })
        return c.json({message:"Post Disliked"})
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

postsGroup.post('decrement/dislike',async(c)=>{
    try
    {
        console.log();
        
        const {post_id,user_name}=await c.req.json()
        const post=await prisma.post.update({
            where:{
                id:post_id
            },
            data:{
                dislikes:{
                    decrement:1
                },
                disliked_by:{
                    disconnect:{
                        user_name:user_name
                    }
                }
            }
        })
        return c.json({message:"Post Dislike Decremented"})
    }
    catch(e)
    {
        return c.json({message:"Error"})
    }
    finally
    {
        await prisma.$disconnect()
    }
})

export default postsGroup