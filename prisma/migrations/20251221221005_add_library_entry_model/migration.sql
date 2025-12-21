-- CreateTable
CREATE TABLE "library_entry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "novelId" TEXT NOT NULL,
    "lastReadChapterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "library_entry_userId_novelId_key" ON "library_entry"("userId", "novelId");

-- AddForeignKey
ALTER TABLE "library_entry" ADD CONSTRAINT "library_entry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_entry" ADD CONSTRAINT "library_entry_novelId_fkey" FOREIGN KEY ("novelId") REFERENCES "novel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_entry" ADD CONSTRAINT "library_entry_lastReadChapterId_fkey" FOREIGN KEY ("lastReadChapterId") REFERENCES "chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
