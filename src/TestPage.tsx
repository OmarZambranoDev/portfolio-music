export default function TestPage() {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'red' }}>
      <div
        style={{
          height: 64,
          background: 'blue',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Header
      </div>
      <div style={{ flex: 1, background: 'green', overflow: 'auto' }}>Content</div>
      <div style={{ height: 80, background: 'yellow' }}>Footer</div>
    </div>
  );
}
