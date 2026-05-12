export default function TestPage() {
  return (
    <div style={{ height: '50dvh', display: 'flex', flexDirection: 'column', background: 'red' }}>
      <div
        style={{
          height: 64,
          background: 'blue',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Header - 50dvh
      </div>
      <div style={{ flex: 1, background: 'green', overflow: 'auto' }}>Content - Half Screen</div>
      <div style={{ height: 80, background: 'yellow' }}>Footer</div>
    </div>
  );
}
