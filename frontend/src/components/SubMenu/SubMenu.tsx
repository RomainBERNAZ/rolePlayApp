import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SubMenu.css';

interface SubMenuItem {
  id: string;
  label: string;
  path: string;
}

interface SubMenuProps {
  items: SubMenuItem[];
  activeId: string;
  setActiveId: (id: string) => void;
}

const SubMenu: React.FC<SubMenuProps> = ({ items, activeId, setActiveId }) => { // Ajout de activeId et setActiveId
  const navigate = useNavigate();

  const handleItemClick = (id: string, path: string) => {
    navigate(path);
  };

  return (
    <nav className="sub-menu">
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button
              className={activeId === item.id ? 'active' : ''} // Utilisation de activeId
              onClick={() => {
                handleItemClick(item.id, item.path);
                setActiveId(item.id); // Mise à jour de activeId
              }}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SubMenu;
