import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get(`/reviews/product/${productId}`);
      setReviews(data.reviews);
    };
    if (productId) load();
  }, [productId]);

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/reviews', { productId, rating, comment });
    setReviews((r)=> [data, ...r]);
    setComment('');
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-2">Reviews</h2>
      <form onSubmit={submit} className="flex gap-2 mb-4">
        <select value={rating} onChange={(e)=>setRating(Number(e.target.value))} className="border rounded px-2">
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <input value={comment} onChange={(e)=>setComment(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Write a review" />
        <button className="px-3 py-2 bg-blue-600 text-white rounded">Post</button>
      </form>
      <div className="space-y-2">
        {reviews.map(r => (
          <div key={r._id} className="bg-white border rounded p-3">
            <div className="text-sm text-gray-600">{r.user?.name} • {r.rating}/5</div>
            <div>{r.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
}







