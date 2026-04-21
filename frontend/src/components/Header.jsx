export default function Header() {
  return (
    <header>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '3px solid #06b6d4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#06b6d4',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
        }}>
          📊
        </div>
        <div>
          <h1>Lead<br/>Prodos.ia</h1>
          <p>Prospection IA avancée</p>
        </div>
      </div>
    </header>
  )
}
