-- CreateTable
CREATE TABLE "User" (
    "user_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_name")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "likes" INTEGER NOT NULL,
    "dislikes" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_name" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_name" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_liked_posts" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_disliked_posts" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_name_key" ON "User"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "_liked_posts_AB_unique" ON "_liked_posts"("A", "B");

-- CreateIndex
CREATE INDEX "_liked_posts_B_index" ON "_liked_posts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_disliked_posts_AB_unique" ON "_disliked_posts"("A", "B");

-- CreateIndex
CREATE INDEX "_disliked_posts_B_index" ON "_disliked_posts"("B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "User"("user_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "User"("user_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_liked_posts" ADD CONSTRAINT "_liked_posts_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_liked_posts" ADD CONSTRAINT "_liked_posts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_disliked_posts" ADD CONSTRAINT "_disliked_posts_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_disliked_posts" ADD CONSTRAINT "_disliked_posts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_name") ON DELETE CASCADE ON UPDATE CASCADE;
