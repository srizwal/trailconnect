import React from 'react';

export function SkeletonCard({ height = 340 }) {
  return <div className="skeleton" style={{ height, borderRadius: 16 }} />;
}

export function SkeletonText({ width = '100%', height = 16, style = {} }) {
  return <div className="skeleton" style={{ width, height, borderRadius: 8, ...style }} />;
}

export function SkeletonAvatar({ size = 44 }) {
  return <div className="skeleton" style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0 }} />;
}

export function TrekCardSkeleton() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: 200 }} />
      <div style={{ padding: '1rem' }}>
        <SkeletonText height={20} style={{ marginBottom: 10 }} />
        <SkeletonText width="60%" height={14} style={{ marginBottom: 8 }} />
        <SkeletonText width="80%" height={14} style={{ marginBottom: 8 }} />
        <SkeletonText width="40%" height={6} style={{ marginBottom: 10 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <SkeletonAvatar size={28} />
          <SkeletonText width="30%" height={12} />
        </div>
      </div>
    </div>
  );
}

export function GuideCardSkeleton() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: 110 }} />
      <div style={{ padding: '0.75rem 1rem' }}>
        <SkeletonAvatar size={52} />
        <SkeletonText height={18} style={{ marginTop: 8, marginBottom: 6 }} />
        <SkeletonText width="60%" height={12} style={{ marginBottom: 6 }} />
        <SkeletonText width="40%" height={12} style={{ marginBottom: 10 }} />
        <div style={{ display: 'flex', gap: 6 }}>
          {[1,2,3].map(i => <SkeletonText key={i} width={50} height={22} style={{ borderRadius: 20 }} />)}
        </div>
      </div>
    </div>
  );
}
