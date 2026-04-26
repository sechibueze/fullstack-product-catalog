'use client';
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // send to your analytics service like Google Analytics
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[WebVital] ${metric.name}:`,
        Math.round(metric.value),
        metric.rating,
      );
    }

    // send to a backend server or directly to an analytics service
    // fetch('/api/vitals', {
    //   method: 'POST',
    //   body: JSON.stringify(metric),
    // })
  });

  return null;
}
