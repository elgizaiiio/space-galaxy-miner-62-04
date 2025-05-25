
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, QrCode, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({ isOpen, onClose, address }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ عنوان المحفظة إلى الحافظة",
    });
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-xl border-2 border-indigo-500/40 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              استقبال العملات
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          {/* QR Code Placeholder */}
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center">
              <div className="text-center">
                <QrCode className="w-16 h-16 text-white/60 mx-auto mb-2" />
                <p className="text-sm text-gray-300">QR Code</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-3">
            <Label className="text-white font-semibold">عنوان المحفظة</Label>
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
              <code className="text-xs text-gray-200 flex-1 break-all leading-relaxed font-mono">
                {address}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="text-white hover:bg-white/10 h-10 w-10 p-0 rounded-xl flex-shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-sm text-yellow-200 text-center leading-relaxed">
              شارك هذا العنوان لاستقبال العملات الرقمية. تأكد من صحة العنوان قبل المشاركة.
            </p>
          </div>

          <Button
            onClick={copyToClipboard}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-12 text-base font-semibold"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                تم النسخ!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-2" />
                نسخ العنوان
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <label className={`block text-sm font-medium ${className}`}>{children}</label>
);

export default ReceiveModal;
