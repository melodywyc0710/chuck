import { homeworkSheets, type HomeworkQuestion, type HomeworkSection, type HomeworkSheet } from '../data/homeworkSheets';
import { useAppStore } from '../store/appStore';

interface Props {
  sessionId: string;
}

function AnswerLines({ count }: { count: number }) {
  return (
    <div className="mt-2 space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{ borderBottom: '1px solid #9ca3af', minHeight: '1.8rem', width: '100%' }}
        />
      ))}
    </div>
  );
}

function AnswerBox() {
  return (
    <div
      style={{
        border: '1px solid #9ca3af',
        borderRadius: '4px',
        minHeight: '220px',
        width: '100%',
        marginTop: '0.5rem',
        backgroundImage:
          'repeating-linear-gradient(transparent, transparent 1.75rem, #e5e7eb 1.75rem, #e5e7eb calc(1.75rem + 1px))',
        backgroundPositionY: '0.25rem',
      }}
    />
  );
}

function QuestionItem({ q }: { q: HomeworkQuestion }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
        <span
          style={{
            fontWeight: 700,
            fontSize: '0.875rem',
            minWidth: '1.75rem',
            color: '#374151',
            paddingTop: '0.1rem',
            flexShrink: 0,
          }}
        >
          {q.number}.
        </span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.875rem', color: '#1f2937', whiteSpace: 'pre-line', margin: 0, lineHeight: '1.5' }}>
            {q.text}
          </p>
          {q.hasBox ? <AnswerBox /> : <AnswerLines count={q.lines} />}
        </div>
      </div>
    </div>
  );
}

function SectionBlock({ section }: { section: HomeworkSection }) {
  return (
    <div
      style={{
        marginBottom: '2rem',
        pageBreakInside: 'avoid',
        breakInside: 'avoid',
      }}
    >
      <div
        style={{
          backgroundColor: '#1e3a5f',
          color: 'white',
          padding: '0.4rem 0.75rem',
          borderRadius: '4px',
          marginBottom: '0.5rem',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{section.heading}</span>
      </div>
      <p style={{ fontSize: '0.8rem', color: '#4b5563', marginBottom: '0.75rem', fontStyle: 'italic' }}>
        {section.instructions}
      </p>
      {section.questions.map((q) => (
        <QuestionItem key={q.number} q={q} />
      ))}
    </div>
  );
}

function SheetHeader({ sheet, studentName }: { sheet: HomeworkSheet; studentName: string }) {
  return (
    <div
      style={{
        borderBottom: '2px solid #1e3a5f',
        paddingBottom: '0.75rem',
        marginBottom: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Logo placeholder */}
        <div
          style={{
            width: '80px',
            height: '60px',
            border: '2px dashed #9ca3af',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.65rem',
            color: '#9ca3af',
            textAlign: 'center',
            lineHeight: '1.2',
          }}
        >
          School Logo
        </div>

        {/* Centre title */}
        <div style={{ flex: 1, textAlign: 'center', padding: '0 1rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Learn4 · Year {sheet.yearLevel} {sheet.subject}
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e3a5f', margin: '0.2rem 0' }}>
            {sheet.title}
          </h1>
          <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Victorian Curriculum: {sheet.victorianCode}</div>
        </div>

        {/* Right column: name & date */}
        <div style={{ minWidth: '160px' }}>
          <div style={{ marginBottom: '0.4rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '2px' }}>Student Name</div>
            <div style={{ borderBottom: '1px solid #374151', minHeight: '1.4rem', fontSize: '0.875rem' }}>
              {studentName}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '2px' }}>Date</div>
            <div style={{ borderBottom: '1px solid #374151', minHeight: '1.4rem' }} />
          </div>
        </div>
      </div>

      {/* Timing note */}
      <div
        style={{
          marginTop: '0.75rem',
          backgroundColor: '#f0f4ff',
          border: '1px solid #c7d2fe',
          borderRadius: '4px',
          padding: '0.35rem 0.75rem',
          fontSize: '0.75rem',
          color: '#4338ca',
        }}
      >
        ⏱ This worksheet is designed for approximately 60 minutes of independent work. Take your time and show all your working.
      </div>
    </div>
  );
}

export default function PrintableHomework({ sessionId }: Props) {
  const { setView, profile } = useAppStore();
  const sheet: HomeworkSheet | undefined = homeworkSheets[sessionId];

  if (!sheet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl p-8 shadow text-center max-w-md">
          <div className="text-4xl mb-3">📄</div>
          <h2 className="font-black text-gray-800 text-lg mb-2">No worksheet found</h2>
          <p className="text-gray-500 text-sm mb-4">
            There is no homework worksheet for session "{sessionId}" yet.
          </p>
          <button
            onClick={() => setView('home')}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const studentName = profile?.name ?? '';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Screen-only toolbar */}
      <div
        className="bg-white shadow-sm sticky top-0 z-10 flex items-center justify-between px-4 py-3 print:hidden"
      >
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 font-semibold"
        >
          ← Back
        </button>
        <div className="font-bold text-gray-700 text-sm">{sheet.title} — Homework Worksheet</div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
        >
          🖨 Print
        </button>
      </div>

      {/* Printable area */}
      <div
        id="printable-homework"
        style={{
          maxWidth: '800px',
          margin: '1.5rem auto',
          backgroundColor: 'white',
          padding: '2.5rem 2.5rem 2rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
          fontFamily: "'Segoe UI', Arial, sans-serif",
        }}
      >
        <SheetHeader sheet={sheet} studentName={studentName} />
        {sheet.sections.map((section, i) => (
          <SectionBlock key={i} section={section} />
        ))}

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid #e5e7eb',
            marginTop: '2rem',
            paddingTop: '0.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.7rem',
            color: '#9ca3af',
          }}
        >
          <span>Learn4 · learn4.edu.au</span>
          <span>Year {sheet.yearLevel} {sheet.subject} · {sheet.victorianCode}</span>
          <span>© Learn4 Education</span>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; margin: 0; }
          #printable-homework {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 1.5cm 2cm !important;
            max-width: 100% !important;
          }
          .print\\:hidden { display: none !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
