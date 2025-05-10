import React from 'react';
import { Star } from 'lucide-react';
import DashboardHeader from '../components/provider/Header';

function ReviewCard({ review }) {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-primary text-primary' : 'text-primary'}`}
        />
      );
    }
    return <div className="flex items-center">{stars}</div>;
  };

  return (
    <li>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-start">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm sm:text-xl font-medium text-gray-900">
                {review.name}
              </p>
              <div className="flex items-center">
                {renderStars(review.rating)}
                <p className="ml-2 text-sm text-gray-500">
                  {review.rating}.0
                </p>
              </div>
            </div>
            <p className="mt-1 text-[12px] sm:text-sm text-gray-500">
              {review.comment}
            </p>
            <div className="mt-2 text-sm text-gray-500 flex gap-2">
              <p>{review.service}</p>•
              <p>{review.date}</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function ProviderReview() {
  const reviewsData = [
    {
      name: 'Sarah Williams',
      rating: 5,
      comment: 'Excellent service! Very professional and thorough with the cleaning. Will definitely book again.',
      service: 'Home Cleaning Service',
      date: '2 Days Ago',
    },
    // Add more review objects here if needed
  ];

  return (<>
  
      <DashboardHeader />
    <main className="p-5 mx-auto py-4 px-3 sm:px-6 lg:px-8 pt-20 z-0 overflow-x-scroll">
      <div className="bg-gray-50 shadow overflow-hidden sm:rounded-md max-w-6xl mx-auto">
        <ul role="list" className="divide-y divide-gray-200">
          {reviewsData.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </ul>
      </div>
    </main>
  </>
  );
}

export default ProviderReview;