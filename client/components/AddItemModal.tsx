import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: { name: string; quantity: number; price: number; category: string }) => void;
  defaultCategory?: string;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  defaultCategory = ""
}) => {
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    price: 0,
    category: defaultCategory || "Khác"
  });

  const categories = [
    "Đồ dùng cá nhân",
    "Đồ vệ sinh", 
    "Đồ giặt",
    "Dụng cụ sinh hoạt",
    "Y tế",
    "Học tập",
    "Quần áo",
    "Tùy chọn",
    "Khác"
  ];

  const handleSubmit = () => {
    if (newItem.name.trim() && newItem.price > 0) {
      onAddItem(newItem);
      setNewItem({ name: "", quantity: 1, price: 0, category: defaultCategory || "Khác" });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-green-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-green-400 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Thêm vật phẩm mới
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Tên vật phẩm</label>
            <Input
              placeholder="Nhập tên vật phẩm..."
              value={newItem.name}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              className="bg-slate-700 border-green-500/30 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Số lượng</label>
              <Input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                className="bg-slate-700 border-green-500/30 text-white"
                min="1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Giá (VND)</label>
              <Input
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem(prev => ({ ...prev, price: Math.max(0, parseInt(e.target.value) || 0) }))}
                className="bg-slate-700 border-green-500/30 text-white"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Danh mục</label>
            <Select value={newItem.category} onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="bg-slate-700 border-green-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-green-500/30">
                {categories.map(category => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-slate-600">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-500 text-gray-300 hover:bg-gray-700"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!newItem.name.trim() || newItem.price === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
