import {FaChevronDown, FaChevronUp} from 'react-icons/fa6'

export default function Section({icon, text, content, tag, activeSection, setActiveSection}) {
    return (
    <div>
      <div className="flex w-full justify-between items-center bg-slate-900 md:rounded-t-md p-2 text-slate-200 text-xl font-bold justify-between">
        <p className="flex items-center gap-1.5">
            {icon}
            {text}
        </p>
        <button className="block md:hidden" onClick={() => setActiveSection(tag)}>
          <p>{activeSection === tag ? <FaChevronUp /> : <FaChevronDown />}</p>
        </button>
      </div>
        <div className={`${activeSection === tag ?'flex' : 'hidden'} md:flex gap-3 px-3 py-3 bg-slate-800 md:rounded-b-md`}>
            {content}
        </div>
    </div>
    );
  }