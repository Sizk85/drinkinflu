import { Navbar } from '@/components/navbar'
import { PostJobForm } from '@/components/post-job-form'

export default function PostJobPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
            โพสต์งาน
          </h1>
          <p className="text-xl text-muted">
            เลือกอินฟลูที่เหมาะกับร้านของคุณ ระบบคำนวณราคาให้อัตโนมัติ
          </p>
        </div>

        {/* Form */}
        <PostJobForm />
      </div>
    </div>
  )
}

