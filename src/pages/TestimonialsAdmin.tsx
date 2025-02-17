import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import "./Responsive.css";

interface Testimonial {
  id: number;
  approved: boolean;
  name: string;
  content: string;
}

const TestimonialsAdmin: React.FC = () => {
  const [approvedTestimonials, setApprovedTestimonials] = useState<Testimonial[]>([]);
  const [pendingTestimonials, setPendingTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase.from("testimonials").select("*");
      const testimonials: Testimonial[] = data ?? [];
      setApprovedTestimonials(testimonials.filter((t) => t.approved));
      setPendingTestimonials(testimonials.filter((t) => !t.approved));
    };
    fetchTestimonials();
  }, []);

  const approveTestimonial = async (id: number) => {
    await supabase.from("testimonials").update({ approved: true }).eq("id", id);
    const approvedTestimonial = pendingTestimonials.find((t) => t.id === id);
    if (approvedTestimonial) {
      setApprovedTestimonials((prev) => [...prev, approvedTestimonial]);
    }
    setPendingTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const deleteTestimonial = async (id: number, isApproved: boolean) => {
    await supabase.from("testimonials").delete().eq("id", id);
    if (isApproved) {
      setApprovedTestimonials((prev) => prev.filter((test) => test.id !== id));
    } else {
      setPendingTestimonials((prev) => prev.filter((test) => test.id !== id));
    }
  };

  return (
    <div className="testimonials-admin-container">
      <h2>Pending Testimonials</h2>
      {pendingTestimonials.map((test) => (
        <div className="testimonials-admin-card" key={test.id}>
          <p>
            <strong>Name:</strong> {test.name}
          </p>
          <p>
            <strong>Content:</strong> {test.content}
          </p>
          <div className="testimonials-admin-actions">
            <button onClick={() => approveTestimonial(test.id)}>Approve</button>
            <button onClick={() => deleteTestimonial(test.id, false)}>Delete</button>
          </div>
        </div>
      ))}

      <h2>Approved Testimonials</h2>
      {approvedTestimonials.map((test) => (
        <div className="testimonials-admin-card" key={test.id}>
          <p>
            <strong>Name:</strong> {test.name}
          </p>
          <p>
            <strong>Content:</strong> {test.content}
          </p>
          <div className="testimonials-admin-actions">
            <button onClick={() => deleteTestimonial(test.id, true)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestimonialsAdmin;