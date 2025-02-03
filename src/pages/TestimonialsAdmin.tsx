import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const TestimonialsAdmin = () => {
  const [approvedTestimonials, setApprovedTestimonials] = useState([]);
  const [pendingTestimonials, setPendingTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase.from("testimonials").select("*");
      setApprovedTestimonials(data.filter((t) => t.approved) || []);
      setPendingTestimonials(data.filter((t) => !t.approved) || []);
    };
    fetchTestimonials();
  }, []);

  const approveTestimonial = async (id) => {
    await supabase.from("testimonials").update({ approved: true }).eq("id", id);
    setApprovedTestimonials([...approvedTestimonials, pendingTestimonials.find((t) => t.id === id)]);
    setPendingTestimonials(pendingTestimonials.filter((t) => t.id !== id));
  };

  return (
    <div>
      <h2>Pending Testimonials</h2>
      {pendingTestimonials.map((test) => (
        <div key={test.id}>
          <p>{test.content}</p>
          <button onClick={() => approveTestimonial(test.id)}>Approve</button>
        </div>
      ))}

      <h2>Approved Testimonials</h2>
      {approvedTestimonials.map((test) => (
        <div key={test.id}>
          <p>{test.content}</p>
        </div>
      ))}
    </div>
  );
};

export default TestimonialsAdmin;
