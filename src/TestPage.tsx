export default function TestPage() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'red' }}>
      <div
        style={{
          height: 64,
          background: 'blue',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        Header
      </div>
      <div style={{ flex: 1, background: 'green', overflow: 'auto', color: 'white', padding: 16 }}>
        Content - Should Fill Space
      </div>
      <div
        style={{
          height: 80,
          background: 'yellow',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Footer
      </div>
    </div>
  );
}
