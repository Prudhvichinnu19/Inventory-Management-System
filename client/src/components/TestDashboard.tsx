import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type TestResult = {
  id: string;
  status: 'not-run' | 'running' | 'passed' | 'failed';
  message?: string;
};

export default function TestDashboard() {
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({
    get: { id: 'get', status: 'not-run' },
    post: { id: 'post', status: 'not-run' },
    put: { id: 'put', status: 'not-run' },
    delete: { id: 'delete', status: 'not-run' },
    integration: { id: 'integration', status: 'not-run' },
  });
  
  const runTest = async (testType: string) => {
    // Update status to running
    setTestResults(prev => ({
      ...prev,
      [testType.toLowerCase()]: {
        ...prev[testType.toLowerCase()],
        status: 'running',
      }
    }));
    
    try {
      const response = await apiRequest("POST", `/api/test/${testType}`, undefined);
      const result = await response.json();
      
      if (result.success) {
        setTestResults(prev => ({
          ...prev,
          [testType.toLowerCase()]: {
            ...prev[testType.toLowerCase()],
            status: 'passed',
            message: result.message
          }
        }));
        
        toast({
          title: `${testType} Test Passed`,
          description: result.message,
          variant: "default",
        });
      } else {
        setTestResults(prev => ({
          ...prev,
          [testType.toLowerCase()]: {
            ...prev[testType.toLowerCase()],
            status: 'failed',
            message: result.message
          }
        }));
        
        toast({
          title: `${testType} Test Failed`,
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Error running ${testType} test:`, error);
      
      setTestResults(prev => ({
        ...prev,
        [testType.toLowerCase()]: {
          ...prev[testType.toLowerCase()],
          status: 'failed',
          message: error instanceof Error ? error.message : String(error)
        }
      }));
      
      toast({
        title: `${testType} Test Failed`,
        description: `An error occurred: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Test Dashboard</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Run tests to verify API and CRUD functionality
          </p>
        </div>
        <div className="mt-4 space-y-3">
          <TestItem 
            id="get"
            label="Test GET"
            result={testResults.get}
            onTest={() => runTest('GET')}
          />
          <TestItem 
            id="post"
            label="Test POST"
            result={testResults.post}
            onTest={() => runTest('POST')}
          />
          <TestItem 
            id="put"
            label="Test PUT"
            result={testResults.put}
            onTest={() => runTest('PUT')}
          />
          <TestItem 
            id="delete"
            label="Test DELETE"
            result={testResults.delete}
            onTest={() => runTest('DELETE')}
          />
          <TestItem 
            id="integration"
            label="Run Integration Test"
            result={testResults.integration}
            onTest={() => runTest('INTEGRATION')}
            isIntegration
          />
        </div>
      </div>
    </div>
  );
}

interface TestItemProps {
  id: string;
  label: string;
  result: TestResult;
  onTest: () => void;
  isIntegration?: boolean;
}

function TestItem({ id, label, result, onTest, isIntegration = false }: TestItemProps) {
  return (
    <div className="flex items-center">
      <Button 
        id={`test${id}Btn`}
        onClick={onTest}
        variant={isIntegration ? "secondary" : "default"}
        className="flex-1"
        disabled={result.status === 'running'}
      >
        {label}
      </Button>
      <span className="ml-3 text-sm">
        {result.status === 'not-run' && (
          <span className="text-gray-400">Not Run</span>
        )}
        {result.status === 'running' && (
          <span className="text-blue-500 flex items-center">
            <Clock className="h-4 w-4 mr-1 animate-spin" /> Running...
          </span>
        )}
        {result.status === 'passed' && (
          <span className="text-green-500 flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" /> Passed
          </span>
        )}
        {result.status === 'failed' && (
          <span className="text-red-500 flex items-center">
            <XCircle className="h-4 w-4 mr-1" /> Failed
          </span>
        )}
      </span>
    </div>
  );
}
