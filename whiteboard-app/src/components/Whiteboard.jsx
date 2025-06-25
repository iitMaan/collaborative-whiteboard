import { useEffect, useRef, useState } from 'react';
import socket from '../utils/socket';
import Toolbar from './Toolbar';
import { useParams, useLocation } from 'react-router-dom';
import ShareModal from './ShareModal';

const Whiteboard = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const accessType = query.get('accessType') || 'public';
  const permission = query.get('permission') || 'edit';
  const canEdit = permission === 'edit';
  const [showModal, setShowModal] = useState(false);

  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  const [activeTool, setActiveTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  const toolRef = useRef(activeTool);
  const colorRef = useRef(color);
  const brushSizeRef = useRef(brushSize);

  useEffect(() => { toolRef.current = activeTool; }, [activeTool]);
  useEffect(() => { colorRef.current = color; }, [color]);
  useEffect(() => { brushSizeRef.current = brushSize; }, [brushSize]);

  useEffect(() => {
    const initFabric = async () => {
      const fabricModule = await import('fabric').then(mod => mod.fabric || mod.default || mod);

      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }

      const canvas = new fabricModule.Canvas(canvasRef.current, {
        backgroundColor: 'white',
        isDrawingMode: canEdit,
      });
      canvas.setHeight(600);
      canvas.setWidth(800);

      canvas.freeDrawingBrush = new fabricModule.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = colorRef.current;
      canvas.freeDrawingBrush.width = brushSizeRef.current;

      if (!canEdit) {
        canvas.selection = false;
        canvas.skipTargetFind = true;
      }

      canvas.on('path:created', (e) => {
        if (!canEdit) return;
        const pathData = e.path.toObject();
        pathData.type = 'path';
        socket.emit('drawing', { roomId, pathData });
      });

      socket.on('receive-drawing', (pathData) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const { path, type, version, ...options } = pathData;
        let object;

        if (type === 'path') {
          object = new fabricModule.Path(path, options);
        } else if (type === 'rect') {
          object = new fabricModule.Rect(options);
        } else if (type === 'circle') {
          object = new fabricModule.Circle(options);
        } else if (type === 'textbox') {
          object = new fabricModule.Textbox(options.text, options);
        }

        if (object) {
          canvas.add(object);
          canvas.requestRenderAll();
        }
      });

      socket.on('receive-sync', (objects) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        canvas.clear();
        canvas.backgroundColor = 'white';
        canvas.renderAll();

        fabricModule.util.enlivenObjects(objects, (enlivenedObjects) => {
          enlivenedObjects.forEach(obj => canvas.add(obj));
          canvas.renderAll();
        });
      });

      socket.on('request-sync', ({ roomId: r }) => {
        const canvas = fabricCanvasRef.current;
        if (canvas) {
          const objects = canvas.getObjects().map(obj => obj.toObject());
          socket.emit('sync-canvas', { roomId: r, objects });
        }
      });

      const broadcastCanvas = () => {
        if (!canEdit) return;
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const objects = canvas.getObjects().map(obj => obj.toObject());
        socket.emit('sync-canvas', { roomId, objects });
      };

      canvas.on('object:modified', (e) => {
        if (!canEdit) return;
        const obj = e.target;
        if (!obj) return;

        if (obj.type === 'textbox') {
          // ✨ Emit the updated textbox object
          const data = obj.toObject();
          data.type = 'textbox';
          socket.emit('drawing', { roomId, pathData: data });
        } else {
          // Optional: full sync for other types if needed
          broadcastCanvas();
        }
      });



      let isDrawing = false;
      let origX = 0, origY = 0;
      let shape = null;

      canvas.on('mouse:down', function (opt) {
        if (!canEdit) return;

        const pointer = canvas.getPointer(opt.e);
        origX = pointer.x;
        origY = pointer.y;

        const tool = toolRef.current;
        const color = colorRef.current;

        if (tool === 'rectangle') {
          isDrawing = true;
          shape = new fabricModule.Rect({
            left: origX, top: origY,
            originX: 'left', originY: 'top',
            width: 0, height: 0, fill: color,
            selectable: false,
          });
          canvas.add(shape);
        }

        if (tool === 'circle') {
          isDrawing = true;
          shape = new fabricModule.Circle({
            left: origX, top: origY,
            originX: 'center', originY: 'center',
            radius: 1, fill: color,
            selectable: false,
          });
          canvas.add(shape);
        }

        if (tool === 'text') {
          const text = new fabricModule.Textbox('Type here', {
            left: pointer.x, top: pointer.y,
            fontSize: 20, fill: color,
            editable: true, selectable: true,
          });
          canvas.add(text);
          canvas.setActiveObject(text);
          canvas.requestRenderAll();
          const textData = text.toObject();
          textData.type = 'textbox';
          socket.emit('drawing', { roomId, pathData: text.toObject() });
          setTimeout(() => text.enterEditing(), 0);
        }
      });

      canvas.on('mouse:move', function (opt) {
        if (!canEdit || !isDrawing || !shape) return;

        const pointer = canvas.getPointer(opt.e);

        if (toolRef.current === 'rectangle') {
          shape.set({
            width: Math.abs(pointer.x - origX),
            height: Math.abs(pointer.y - origY),
            left: Math.min(pointer.x, origX),
            top: Math.min(pointer.y, origY),
          });
        }

        if (toolRef.current === 'circle') {
          const r = Math.sqrt((pointer.x - origX) ** 2 + (pointer.y - origY) ** 2) / 2;
          shape.set({
            radius: r,
            left: (pointer.x + origX) / 2,
            top: (pointer.y + origY) / 2,
          });
        }

        canvas.requestRenderAll();
      });

      canvas.on('mouse:up', () => {
        if (!canEdit) return;
        isDrawing = false;

        if (shape) {
          const shapeData = shape.toObject();
          shapeData.type = shape.type;
          socket.emit('drawing', { roomId, pathData: shapeData });
        }

        shape = null;
      });

      canvas.on('mouse:dblclick', (opt) => {
        if (!canEdit) return;
        const target = opt.target;
        if (target && target.type === 'textbox') {
          canvas.setActiveObject(target);
          canvas.renderAll();
        }
      });

      fabricCanvasRef.current = canvas;
    };

    initFabric();

    socket.emit('join-room', roomId);
    socket.emit('request-sync', { roomId });

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
      socket.off('receive-drawing');
      socket.off('receive-sync');
      socket.off('request-sync');
    };
  }, [roomId]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canEdit) return;

    if (toolRef.current === 'pencil') {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = colorRef.current;
      canvas.freeDrawingBrush.width = brushSizeRef.current;
    } else if (toolRef.current === 'eraser') {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = 'white';
      canvas.freeDrawingBrush.width = brushSizeRef.current + 10;
    } else {
      canvas.isDrawingMode = false;
    }
  }, [activeTool, color, brushSize, canEdit]);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-4">
        {canEdit && (
          <>
            <Toolbar
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              color={color}
              setColor={setColor}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
            />
            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Share Room
            </button>
          </>
        )}
        {!canEdit && <div className="text-sm text-red-600 font-semibold">View-Only Mode</div>}
      </div>

      <canvas ref={canvasRef} className="border border-gray-400" />

      <ShareModal roomId={roomId} isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Whiteboard;
