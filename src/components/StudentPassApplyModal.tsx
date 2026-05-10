'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMode } from '@/hooks/useMode';
import { TZ } from '@/lib/tz';
import Input from '@/components/ui/Input';
import Select from './ui/Select';

interface StudentPassApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudentPassApplyModal({ isOpen, onClose, onSuccess }: StudentPassApplyModalProps) {
  const { isClassic } = useMode();
  const accent = isClassic ? '#9A1E29' : '#4AA056';

  const [studentId, setStudentId] = useState('');
  const [year, setYear] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setStudentId('');
    setYear('');
    setAadhaarNumber('');
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await TZ.storefront.student.applyForPass({
        studentIdNumber: studentId,
        idImageUrl: aadhaarNumber,
        institutionId: year,
      });
      setSuccess(true);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const aadhaarClean = aadhaarNumber.replace(/\D/g, '');
  const canSubmit = studentId.trim().length >= 3 && year !== '' && aadhaarClean.length === 12;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-6 py-5 text-white"
              style={{
                background: isClassic
                  ? 'linear-gradient(135deg, #EB7A29, #9A1E29)'
                  : 'linear-gradient(135deg, #81C784, #4AA056)',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Apply for Student Pass</h2>
                  <p className="text-sm text-white/70 mt-0.5">Fill in your details below</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[280px] flex flex-col">
              {success ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: '#D1FAE5' }}
                  >
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    We&apos;ll verify your student ID and activate your pass within 24-48 hours. You&apos;ll receive a notification once it&apos;s approved.
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full py-3 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98]"
                    style={{ backgroundColor: accent }}
                  >
                    Got it!
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col"
                >
                  <h3 className="text-base font-bold text-gray-900 mb-1">Student Details</h3>
                  <p className="text-sm text-gray-500 mb-5">Enter your student information to get started.</p>

                  <div className="space-y-4 flex-1">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Student ID / Enrollment Number *
                      </label>
                      <Input
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="e.g. 2024BCS001"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Year *
                      </label>
                      <Select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      >
                        <option value="">Select your year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="5th Year">5th Year</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Aadhaar Number *
                      </label>
                      <Input
                        value={aadhaarNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                          // Format as XXXX XXXX XXXX
                          const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                          setAadhaarNumber(formatted);
                        }}
                        placeholder="e.g. 1234 5678 9012"
                        inputMode="numeric"
                      />
                      {aadhaarClean.length > 0 && aadhaarClean.length < 12 && (
                        <p className="text-[0.6875rem] text-amber-600 mt-1">
                          Aadhaar number must be 12 digits
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 mt-4">
                    <p className="text-xs text-amber-700">
                      By applying, you confirm that you are currently enrolled as a student at an accredited Indian educational institution. Misuse may lead to pass suspension.
                    </p>
                  </div>

                  {error && (
                    <div className="mt-3 rounded-xl bg-red-50 border border-red-100 p-3">
                      <p className="text-xs text-red-700">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !canSubmit}
                    className="w-full py-3 rounded-2xl text-sm font-bold text-white mt-4 disabled:opacity-40 transition-all active:scale-[0.98]"
                    style={{ backgroundColor: accent }}
                  >
                    {submitting ? 'Submitting...' : 'Apply'}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
