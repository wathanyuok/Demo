const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ติดต่อเรา</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* ข้อมูลติดต่อ */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">ที่อยู่</h2>
            <p className="text-gray-600">
              เซ็นทรัลเวิลด์<br />
              999/9 ถนนพระราม 1 แขวงปทุมวัน<br />
              เขตปทุมวัน กรุงเทพมหานคร 10330
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">เวลาทำการ</h2>
            <p className="text-gray-600">
              จันทร์ - อาทิตย์: 10:00 - 22:00 น.
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">ติดต่อ</h2>
            <div className="space-y-2 text-gray-600">
              <p>โทร: 02-xxx-xxxx</p>
              <p>อีเมล: contact@example.com</p>
              <p>Line: @example</p>
            </div>
          </div>

      
        </div>

     
        <div className="h-[400px] rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5404646083907!2d100.53492147475556!3d13.746724397572524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ecde3aee521%3A0x9f43939a2caf2963!2sCentralWorld!5e0!3m2!1sen!2sth!4v1708628627071!5m2!1sen!2sth"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;