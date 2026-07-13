import React from 'react';

const AwarenessSection = () => {
  return (
    <section style={{ padding: '50px 20px', textAlign: 'center', backgroundColor: '#fff' }}>
      <h2 style={{ fontSize: '32px', color: '#333', marginBottom: '20px' }}>Why Reduce Food Waste?</h2>
      <p style={{ fontSize: '20px', color: '#555', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
        Every year, billions of tons of food are wasted while millions of people go hungry.
        By reducing food waste, we can not only save money but also save the environment.
      </p>
      <div>
        <img
          src="https://th.bing.com/th/id/OIP.MxXcuUmbtHn3rPeH9hj6GAAAAA?rs=1&pid=ImgDetMain"
          alt="Food Waste Awareness"
          style={{ width: '200px', height: 'auto', marginTop: '20px' }}
        />
        <img
          src="https://i0.wp.com/www.bioenergyconsult.com/wp-content/uploads/2018/01/Food-Waste-Recycling.png?ssl=1"
          alt="Recycling Awareness"
          style={{ width: '200px', height: 'auto', marginTop: '20px' }}
        />
      </div>
    </section>
  );
};

export default AwarenessSection;
