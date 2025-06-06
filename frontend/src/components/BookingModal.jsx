import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const BookingModal = ({ isOpen, onClose, property, booking }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="text-center mb-4">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <FaCheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mt-4"
                  >
                    Booking Successful!
                  </Dialog.Title>
                </div>

                <div className="mt-4">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">{property.title}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>Booking Reference: #{booking.id}</p>
                      <p>Date: {booking.createdAt}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Property Price</span>
                      <span className="font-medium text-gray-900">
                        ${booking.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Platform Commission (5%)</span>
                      <span className="font-medium text-gray-900">
                        ${booking.commission.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-medium">Total Amount</span>
                      <span className="font-bold text-primary-600">
                        ${(booking.totalAmount + booking.commission).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 bg-blue-50 rounded-lg p-4 flex items-start">
                    <FaInfoCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                      A confirmation email has been sent to your registered email address with booking details.
                    </p>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="btn-primary w-full"
                      onClick={onClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BookingModal;